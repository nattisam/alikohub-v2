import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';

@Controller()
@UseGuards(ConTechProfileGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @MessagePattern({ cmd: 'create_task' })
    @UseGuards(RoleGuard)
    @Roles('PROJECT_MANAGER', 'ADMIN')
    async create(@Payload() payload: { dto: CreateTaskDto; user: AuthenticatedUser }) {
        return await this.tasksService.create(payload.dto, payload.user);
    }

    @MessagePattern({ cmd: 'find_tasks_by_project' })
    async findByProject(@Payload() payload: { projectId: number; query: any; user: AuthenticatedUser }) {
        return await this.tasksService.findByProject(payload.projectId, payload.query);
    }

    @MessagePattern({ cmd: 'find_task_by_id' })
    async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
        return await this.tasksService.findOne(payload.id);
    }

    @MessagePattern({ cmd: 'update_task' })
    @UseGuards(RoleGuard)
    @Roles('PROJECT_MANAGER', 'ADMIN', 'CONTRACTOR')
    async update(@Payload() payload: { id: number; dto: UpdateTaskDto; user: AuthenticatedUser }) {
        return await this.tasksService.update(payload.id, payload.dto, payload.user);
    }

    @MessagePattern({ cmd: 'remove_task' })
    @UseGuards(RoleGuard)
    @Roles('PROJECT_MANAGER', 'ADMIN')
    async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
        return await this.tasksService.remove(payload.id, payload.user);
    }

    @MessagePattern({ cmd: 'update_task_progress' })
    @UseGuards(RoleGuard)
    @Roles('PROJECT_MANAGER', 'ADMIN', 'CONTRACTOR')
    async updateProgress(@Payload() payload: { id: number; progress: number; user: AuthenticatedUser }) {
        return await this.tasksService.updateTaskProgress(payload.id, payload.progress, payload.user);
    }

    @MessagePattern({ cmd: 'get_task_stats' })
    @UseGuards(RoleGuard)
    @Roles('PROJECT_MANAGER', 'ADMIN', 'CONTRACTOR')
    async getStats(@Payload() payload: { projectId?: number; assignedTo?: string; user: AuthenticatedUser }) {
        return await this.tasksService.getTaskStats(payload.projectId, payload.assignedTo);
    }
}