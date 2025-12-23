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
  status?: ProjectStatus;
  managerId?: string;
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

      // Check if project with same name exists for this manager
      const existingProject = await this.prisma.project.findFirst({
        where: {
          name: dto.name,
          managerId: user.firebaseId,
        },
      });

      if (existingProject) {
        throw new RpcException('You already have a project with this name');
      }

      const result = await this.prisma.project.create({
        data: {
          ...dto,
          contractorId: user.firebaseId,
          inspectorId: user.firebaseId,
          managerId: user.firebaseId,
          budgetCents: dto.budget ? dto.budget * 100 : null, // Convert to cents
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          startDate: new Date(dto.startDate),
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

  async findAll(query: FindAllQuery) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 10, 50);
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.managerId) where.managerId = query.managerId;
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
              .map((p) => p.managerId)
              .filter((id): id is string => id != null),
          ),
        ];
        const managers = await this.userService.getUsersByIds(managerIds);

    const enrichedProjects = projects.map((project) => ({
      ...project,
      budget: project.budgetCents ? project.budgetCents / 100 : null, // Convert back from cents
      manager: managers.find((m) => m.firebaseId === project.managerId) || null,
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

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Enrich with manager data
    const manager = await this.userService.getUserById(project.contractorId);

    return {
      ...project,
      budget: project.budgetCents ? project.budgetCents / 100 : null,
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
      project.managerId !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this project',
      );
    }

    return await this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        budgetCents: dto.budget ? dto.budget * 100 : undefined,
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
      project.managerId !== user.firebaseId
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
    if (
      contechProfile.role !== 'ADMIN' &&
      project.managerId !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this project status',
      );
    }

    return await this.prisma.project.update({
      where: { id },
      data: {
        status,
        updatedBy: user.firebaseId,
      },
    });
  }

  async getProjectStats(managerId?: string) {
    const where = managerId ? { managerId } : {};

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
