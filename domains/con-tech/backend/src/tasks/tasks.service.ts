import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, TaskPriority } from '../generated/client';
import { AuthenticatedUser, UserService } from '../user/user.service';

type FindTasksQuery = {
    projectId?: number;
    status?: string;
    assignedTo?: string;
    page?: number;
    pageSize?: number;
};

@Injectable()
export class TasksService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
    ) { }

    async create(dto: CreateTaskDto, user: AuthenticatedUser) {
        const contechProfile = await this.userService.getOrCreateProfile(user);

        const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } });
        if (!project) throw new NotFoundException('Project not found');

        if (contechProfile.role !== 'ADMIN' && project.contractorId !== user.firebaseId && project.manager !== user.firebaseId) {
            throw new ForbiddenException('You do not have permission to create tasks for this project');
        }

        if (!dto.assignedTo) throw new BadRequestException('Assigned user is required');
        // Ensure user has a profile and is synced from Auth
        await this.userService.ensureProfileExists(dto.assignedTo);
        const assignee = await this.userService.getUserById(dto.assignedTo);
        if (!assignee) throw new BadRequestException('Assigned user does not exist');

        return await this.prisma.task.create({
            data: {
                projectId: dto.projectId,
                description: dto.description,
                status: 'PENDING',
                deadline: dto.deadline ? new Date(dto.deadline) : new Date(),
                assignedTo: dto.assignedTo,
                isVisibleToClient: dto.isVisibleToClient ?? false,
            },
        });
    }

    async findByProject(projectId: number, query: FindTasksQuery, user: AuthenticatedUser) {
        const contechProfile = await this.userService.getOrCreateProfile(user);
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');

        // RBAC Check
        if (contechProfile.role === 'CLIENT' && project.clientId !== user.firebaseId) {
            throw new ForbiddenException('You do not have permission to view tasks for this project');
        }
        if (contechProfile.role === 'CONTRACTOR' && project.contractorId !== user.firebaseId) {
            // Contractors can only see tasks of their assigned project.
            // Assumption: If I am the contractor of the project, I see ALL tasks? Or only assigned?
            // Usually Contractor manages the project tasks. So checks project.contractorId is enough.
            throw new ForbiddenException('You do not have permission to view tasks for this project');
        }

        const page = query.page || 1;
        const pageSize = Math.min(query.pageSize || 20, 50);
        const skip = (page - 1) * pageSize;

        const where: any = { projectId };
        if (query.status) where.status = query.status;
        if (contechProfile.role === 'CLIENT') {
            where.isVisibleToClient = true;
        }

        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({ where, skip, take: pageSize, orderBy: [{ deadline: 'asc' }] }),
            this.prisma.task.count({ where }),
        ]);

        const assigneeIds = tasks.map((t) => t.assignedTo).filter((id) => id !== null) as string[];
        const assignees = assigneeIds.length > 0 ? await this.userService.getUsersByIds(assigneeIds) : [];

        const enrichedTasks = tasks.map((task) => ({
            ...task,
            assignee: task.assignedTo ? assignees.find((a) => a.firebaseId === task.assignedTo) || null : null,
        }));

        return { items: enrichedTasks, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    }

    async findOne(id: number, user: AuthenticatedUser) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { Project: true }, // Include full project to check clientId/contractorId
        });
        if (!task) throw new NotFoundException('Task not found');
        
        const contechProfile = await this.userService.getOrCreateProfile(user);
        const project = (task as any).Project; 
        
        // RBAC Check
        if (contechProfile.role === 'CLIENT') {
             if (project.clientId !== user.firebaseId || !task.isVisibleToClient) {
                 throw new ForbiddenException('You do not have permission to view this task');
             }
        }
        if (contechProfile.role === 'CONTRACTOR' && project.contractorId !== user.firebaseId && task.assignedTo !== user.firebaseId) {
             throw new ForbiddenException('You do not have permission to view this task');
        }

        if (!task) throw new NotFoundException('Task not found');

        const assignee = task.assignedTo ? await this.userService.getUserById(task.assignedTo) : null;

        return {
            ...task,
            assignee,
        };
    }

    async update(id: number, dto: UpdateTaskDto, user: AuthenticatedUser) {
        const contechProfile = await this.userService.getOrCreateProfile(user);
        const task = await this.prisma.task.findUnique({ where: { id }, include: { Project: true } });
        if (!task) throw new NotFoundException('Task not found');

        const canUpdate = contechProfile.role === 'ADMIN' || (task as any).Project.contractorId === user.firebaseId || task.assignedTo === user.firebaseId;
        if (!canUpdate) throw new ForbiddenException('You do not have permission to update this task');

        if (dto.assignedTo && dto.assignedTo !== task.assignedTo) {
            await this.userService.ensureProfileExists(dto.assignedTo);
            const assignee = await this.userService.getUserById(dto.assignedTo);
            if (!assignee) throw new BadRequestException('Assigned user does not exist');
        }

        const updateData: any = {
            description: dto.description,
            status: dto.status,
            assignedTo: dto.assignedTo,
            deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        };

        return await this.prisma.task.update({ where: { id }, data: updateData });
    }

    async remove(id: number, user: AuthenticatedUser) {
        const contechProfile = await this.userService.getOrCreateProfile(user);
        const task = await this.prisma.task.findUnique({ where: { id }, include: { Project: true } });
        if (!task) throw new NotFoundException('Task not found');

        if (contechProfile.role !== 'ADMIN' && (task as any).Project.contractorId !== user.firebaseId) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        return await this.prisma.task.delete({ where: { id } });
    }

    async updateTaskProgress(id: number, progress: number, user: AuthenticatedUser) {
        const task = await this.prisma.task.findUnique({ where: { id }, include: { Project: true } });
        if (!task) throw new NotFoundException('Task not found');

        if (task.assignedTo !== user.firebaseId && (task as any).Project.contractorId !== user.firebaseId) {
            throw new ForbiddenException('You do not have permission to update this task progress');
        }

        let status = task.status;
        if (progress === 0 && status === 'IN_PROGRESS') status = 'PENDING';
        else if (progress > 0 && progress < 100 && status === 'PENDING') status = 'IN_PROGRESS';
        else if (progress === 100) status = 'COMPLETED';

        return await this.prisma.task.update({
            where: { id },
            data: { status },
        });
    }

    async getTaskStats(user: AuthenticatedUser, projectId?: number, assignedTo?: string) {
        const contechProfile = await this.userService.getOrCreateProfile(user);
        const where: any = {};
        if (projectId) where.projectId = projectId;
        if (assignedTo) where.assignedTo = assignedTo;

        // Role filtering
        if (contechProfile.role === 'CLIENT') {
            where.isVisibleToClient = true;
            // Also ensure project belongs to client if projectId provided
            if (projectId) {
                const project = await this.prisma.project.findUnique({ where: { id: projectId } });
                if (project?.clientId !== user.firebaseId) {
                    throw new ForbiddenException('Unauthorized');
                }
            }
        } else if (contechProfile.role === 'CONTRACTOR' && !assignedTo) {
             // If contractor wants general stats, maybe filter by their projects?
             // For now, let's keep it simple or filter by assignedTo=user.firebaseId if no assignedTo provided.
             // But contractor might want to see ALL tasks for their project.
        }

        const [totalTasks, pendingTasks, inProgressTasks, completedTasks, blockedTasks] = await Promise.all([
            this.prisma.task.count({ where }),
            this.prisma.task.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
            this.prisma.task.count({ where: { ...where, status: 'COMPLETED' } }),
            this.prisma.task.count({ where: { ...where, status: 'BLOCKED' } }),
        ]);

        return { total: totalTasks, pending: pendingTasks, inProgress: inProgressTasks, completed: completedTasks, blocked: blockedTasks, completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0 };
    }
}
