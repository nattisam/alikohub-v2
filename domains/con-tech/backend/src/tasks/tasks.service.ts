import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, TaskPriority } from '@prisma/client';
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

        if (contechProfile.role !== 'ADMIN' && project.manager !== user.firebaseId) {
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
            },
        });
    }

    async findByProject(projectId: number, query: FindTasksQuery) {
        const page = query.page || 1;
        const pageSize = Math.min(query.pageSize || 20, 50);
        const skip = (page - 1) * pageSize;

        const where: any = { projectId };
        if (query.status) where.status = query.status;
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

    async findOne(id: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { Project: { select: { id: true, name: true, contractorId: true } } },
        });

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

    async getTaskStats(projectId?: number, assignedTo?: string) {
        const where: any = {};
        if (projectId) where.projectId = projectId;
        if (assignedTo) where.assignedTo = assignedTo;

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
