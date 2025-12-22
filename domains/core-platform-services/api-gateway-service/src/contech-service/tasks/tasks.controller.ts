import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(@Inject('CONTECH_SERVICE') private contechClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  createTask(@Request() req: RequestWithUser, @Body() createTaskDto: CreateTaskDto) {
    const payload = {
      dto: createTaskDto,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'create_task' }, payload);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all tasks for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID', type: Number })
  @ApiQuery({ name: 'query', required: false, type: Object })
  findTasksByProject(
    @Request() req: RequestWithUser,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() query: any,
  ) {
    const payload = {
      projectId,
      query,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'find_tasks_by_project' }, payload);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics' })
  @ApiQuery({ name: 'projectId', required: false, type: Number })
  @ApiQuery({ name: 'assignedTo', required: false, type: String })
  getTaskStats(@Request() req: RequestWithUser, @Query() query: any) {
    const payload = {
      projectId: query.projectId ? parseInt(query.projectId) : undefined,
      assignedTo: query.assignedTo,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'get_task_stats' }, payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  findTaskById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
    return this.contechClient.send({ cmd: 'find_task_by_id' }, payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  updateTask(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const payload = {
      id,
      dto: updateTaskDto,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'update_task' }, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  removeTask(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'remove_task' }, payload);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update task progress' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiBody({
    schema: { properties: { progress: { type: 'number', example: 50 } } },
  })
  updateTaskProgress(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body('progress') progress: number,
  ) {
    const payload = {
      id,
      progress,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'update_task_progress' }, payload);
  }
}
