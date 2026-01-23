import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';
import { AuthenticatedUser, UserService } from '../user/user.service';
import { winstonLogger } from '../logger';

type FindAllQuery = {
  page?: number;
  pageSize?: number;
  status?: string;
  manager?: string;
  search?: string;
};

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(dto: CreateProjectDto, user: AuthenticatedUser) {
    winstonLogger.info(`Creating project: ${dto.name} for user: ${user.firebaseId}`);
    try {
      const contechProfile = await this.userService.getOrCreateProfile(user);
      winstonLogger.info(`User profile role: ${contechProfile.role}`);

      // Only PROJECT_MANAGER and ADMIN can create projects
      if (
        contechProfile.role !== 'PROJECT_MANAGER' &&
        contechProfile.role !== 'ADMIN'
      ) {
        winstonLogger.warn(`User ${user.firebaseId} with role ${contechProfile.role} tried to create a project`);
        throw new RpcException('You do not have permission to create projects.');
      }

      // Ensure client exists if provided
      if (dto.clientId) await this.userService.ensureProfileExists(dto.clientId);
      if (dto.contractorId) await this.userService.ensureProfileExists(dto.contractorId);

      // Check if project with same name exists for this manager
      const result = await this.prisma.project.create({
        data: {
          ...dto,
          manager: user.firebaseId,
          // contractorId: user.firebaseId, // REMOVE: This was likely a placeholder bug.
          // inspectorId: user.firebaseId, // REMOVE: Placeholder logic?
          // Wait, if not provided in DTO, it shouldn't default to Creator unless intended.
          // Reverting to safe logic: usage of spread ...dto takes precedence if verified, but let's be careful.
          // The creation logic seemed to force contractorId = user.firebaseId. I should fix this.
          contractorId: dto.contractorId, 
          inspectorId: dto.inspectorId,
          endDate: dto.endDate ? new Date(dto.endDate) : new Date(), // Fallback
          startDate: new Date(dto.startDate),
          status: 'PLANNED',
          createdBy: user.firebaseId,
          updatedBy: user.firebaseId,
        },
      });
      winstonLogger.info(`Project created successfully: ${result.id}`);
      return result;
    } catch (error) {
      winstonLogger.error(`Failed to create project: ${error.message} - ${error.stack}`);
      throw error;
    }
  }

  async getContracrors(){
    return this.prisma.contechProfile.findMany({
      where: {role: 'CONTRACTOR'},
      select: {userId: true}
    })
  }

  async getInspectors(){
    return this.prisma.contechProfile.findMany({
      where: {role: 'PROJECT_MANAGER'},
      select: {userId: true}
    })
  }

  async findAll(query: FindAllQuery, user: AuthenticatedUser) {
    const profile = await this.userService.getOrCreateProfile(user);
    winstonLogger.info(`FindAll Projects for user ${user.firebaseId} with role ${profile.role}`);

    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 10, 50);
    const skip = (page - 1) * pageSize;

    const where: any = {};
    
    // RBAC Filtering
    if (profile.role === 'CONTRACTOR') {
      where.contractorId = user.firebaseId;
    } else if (profile.role === 'CLIENT') {
      where.clientId = user.firebaseId;
    }
    // ADMIN and PROJECT_MANAGER see all (or use query filters)

    if (query.status) where.status = query.status;
    if (query.manager) where.manager = query.manager;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    // Enrich with manager data
        const managerIds = [
          ...new Set(
            projects
              .map((p) => p.manager)
              .filter((id): id is string => id != null),
          ),
        ];
        const managers = await this.userService.getUsersByIds(managerIds);

    const enrichedProjects = projects.map((project) => ({
      ...project,
      manager: managers.find((m) => m.firebaseId === project.manager) || null,
      taskStats: {
        total: project.tasks.length,
        completed: project.tasks.filter((t) => t.status === 'COMPLETED').length,
        inProgress: project.tasks.filter((t) => t.status === 'IN_PROGRESS')
          .length,
        pending: project.tasks.filter((t) => t.status === 'PENDING').length,
      },
    }));

    return {
      items: enrichedProjects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // RBAC Check
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role === 'CLIENT' && project.clientId !== user.firebaseId) {
      throw new ForbiddenException('You do not have permission to view this project.');
    }
    if (profile.role === 'CONTRACTOR' && project.contractorId !== user.firebaseId) {
       throw new ForbiddenException('You do not have permission to view this project.');
    }

    // Enrich with manager data
    const manager = await this.userService.getUserById(project.manager);

    return {
      ...project,
      manager,
    };
  }

  async update(id: number, dto: UpdateProjectDto, user: AuthenticatedUser) {
    const contechProfile = await this.userService.getOrCreateProfile(user);
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check permissions: ADMIN can update any project, PROJECT_MANAGER can only update their own
    if (
      contechProfile.role !== 'ADMIN' &&
      project.manager !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this project',
      );
    }

    // Ensure newly assigned users have profiles and are synced
    if (dto.manager) await this.userService.ensureProfileExists(dto.manager);
    if (dto.inspectorId) await this.userService.ensureProfileExists(dto.inspectorId);
    if (dto.contractorId) await this.userService.ensureProfileExists(dto.contractorId);

    return await this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        updatedBy: user.firebaseId,
      },
    });
  }

  async remove(id: number, user: AuthenticatedUser) {
    const contechProfile = await this.userService.getOrCreateProfile(user);
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check permissions
    if (
      contechProfile.role !== 'ADMIN' &&
      project.manager !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this project',
      );
    }

    return await this.prisma.project.delete({ where: { id } });
  }

  async updateStatus(
    id: number,
    status: ProjectStatus,
    user: AuthenticatedUser,
  ) {
    const contechProfile = await this.userService.getOrCreateProfile(user);
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check permissions
    const isManager = project.manager === user.firebaseId;
    const isContractor = project.contractorId === user.firebaseId;

    if (
      contechProfile.role !== 'ADMIN' &&
      !isManager &&
      !(contechProfile.role === 'CONTRACTOR' && isContractor)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this project status',
      );
    }

    return await this.prisma.project.update({
      where: { id },
      data: {
        status: status as string,
        updatedBy: user.firebaseId,
      },
    });
  }

  async updatePhotos(id: number, photos: string[], user: AuthenticatedUser) {
    const contechProfile = await this.userService.getOrCreateProfile(user);
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check permissions
    const isManager = project.manager === user.firebaseId;
    const isContractor = project.contractorId === user.firebaseId;

    if (
      contechProfile.role !== 'ADMIN' &&
      !isManager &&
      !(contechProfile.role === 'CONTRACTOR' && isContractor)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update photos for this project',
      );
    }

    return await this.prisma.project.update({
        where: { id },
        data: { photos, updatedBy: user.firebaseId }
    });
  }

  async getProjectStats(manager?: string) {
    const where = manager ? { manager } : {};

    const [totalProjects, activeProjects, completedProjects, plannedProjects] =
      await Promise.all([
        this.prisma.project.count({ where }),
        this.prisma.project.count({ where: { ...where, status: 'ACTIVE' } }),
        this.prisma.project.count({ where: { ...where, status: 'COMPLETED' } }),
        this.prisma.project.count({ where: { ...where, status: 'PLANNED' } }),
      ]);

    return {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      planned: plannedProjects,
    };
  }
}
