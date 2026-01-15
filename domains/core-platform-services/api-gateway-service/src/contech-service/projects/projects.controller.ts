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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(@Inject('CONTECH_SERVICE') private contechClient: ClientProxy) {}

  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @Post()
  createProject(@Request() req: RequestWithUser, @Body() createProjectDto: CreateProjectDto) {
    const payload = {
      dto: createProjectDto,
      user: req.user,
    };
    return this.contechClient.send({ cmd: 'create_project' }, payload);
  }

  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({ name: 'query', required: false, type: Object })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @Get()
  findAllProjects(@Request() req: RequestWithUser, @Query() query: any) {
    const payload = { query, user: req.user };
    return this.contechClient.send({ cmd: 'find_all_projects' }, payload);
  }

  @ApiOperation({ summary: 'Get project statistics' })
  @ApiQuery({ name: 'managerId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Project stats retrieved successfully',
  })
  @Get('stats')
  getProjectStats(@Request() req: RequestWithUser, @Query('managerId') managerId?: string) {
    const payload = { managerId, user: req.user };
    return this.contechClient.send({ cmd: 'get_project_stats' }, payload);
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @Get(':id')
  findProjectById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
    return this.contechClient.send({ cmd: 'find_project_by_id' }, payload);
  }

  @ApiOperation({ summary: 'Update project details' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @Patch(':id')
  updateProject(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const payload = { id, dto: updateProjectDto, user: req.user };
    return this.contechClient.send({ cmd: 'update_project' }, payload);
  }

  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @Delete(':id')
  removeProject(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
    return this.contechClient.send({ cmd: 'remove_project' }, payload);
  }

  @ApiOperation({ summary: 'Update project status' })
  @ApiBody({ schema: { example: { status: 'ACTIVE' } } })
  @ApiResponse({
    status: 200,
    description: 'Project status updated successfully',
  })
  @Patch(':id/status')
  updateProjectStatus(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: any,
  ) {
    const payload = { id, status, user: req.user };
    return this.contechClient.send({ cmd: 'update_project_status' }, payload);
  }

  @ApiOperation({ summary: 'Get all contractors' })
  @ApiResponse({
    status: 200,
    description: 'Contractors retrieved successfully',
  })
  @Get('contractor')
  findAllContractors(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.contechClient.send({ cmd: 'find_contractor' }, payload);
  }

  @ApiOperation({ summary: 'Get all inspectors' })
  @ApiResponse({
    status: 200,
    description: 'Inspectors retrieved successfully',
  })
  @Get('inspector')
  findAllInspectors(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.contechClient.send({ cmd: 'find_inspector' }, payload);
  }
}
