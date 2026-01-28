import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';
import { CommentsService } from './comments.service';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';

@Controller()
@UseGuards(ConTechProfileGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly commentsService: CommentsService,
  ) {}

  @MessagePattern({ cmd: 'create_project' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async create(
    @Payload() payload: { dto: CreateProjectDto; user: AuthenticatedUser },
  ) {
    return await this.projectsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_all_projects' })
  async findAll(@Payload() payload: { query: any; user: AuthenticatedUser }) {
    return await this.projectsService.findAll(payload.query, payload.user);
  }

  @MessagePattern({ cmd: 'find_project_by_id' })
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.projectsService.findOne(payload.id, payload.user);
  }
  @MessagePattern({cmd: 'find_contractor'})
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async findallcontractor(){
    return await this.projectsService.getContracrors()
  }

  @MessagePattern({cmd: 'find_inspector'})
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async findallinspector(){
    return await this.projectsService.getInspectors()
  }

  @MessagePattern({ cmd: 'update_project' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async update(
    @Payload()
    payload: {
      id: number;
      dto: UpdateProjectDto;
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.update(
      payload.id,
      payload.dto,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'remove_project' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.projectsService.remove(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'update_project_status' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'CONTRACTOR')
  async updateStatus(
    @Payload()
    payload: {
      id: number;
      status: ProjectStatus;
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.updateStatus(
      payload.id,
      payload.status,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'update_project_photos' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'CONTRACTOR')
  async updatePhotos(
    @Payload() payload: { id: number; photos: string[]; user: AuthenticatedUser },
  ) {
    return await this.projectsService.updatePhotos(payload.id, payload.photos, payload.user);
  }

  @MessagePattern({ cmd: 'get_project_stats' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'CONTRACTOR', 'CLIENT')
  async getStats(
    @Payload() payload: { manager?: string; user: AuthenticatedUser },
  ) {
    return await this.projectsService.getProjectStats(payload.user, payload.manager);
  }

  // TEST-03: Update project progress (for contractors)
  @MessagePattern({ cmd: 'update_project_progress' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'CONTRACTOR')
  async updateProgress(
    @Payload()
    payload: {
      id: number;
      progress: number;
      notes?: string;
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.updateProgress(
      payload.id,
      payload.progress,
      payload.user,
      payload.notes,
    );
  }

  // TEST-04: Create project update (weekly summaries)
  @MessagePattern({ cmd: 'create_project_update' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'CONTRACTOR')
  async createUpdate(
    @Payload()
    payload: {
      projectId: number;
      text: string;
      isVisibleToClient?: boolean;
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.createProjectUpdate(
      payload.projectId,
      payload.text,
      payload.user,
      payload.isVisibleToClient,
    );
  }

  // TEST-04: Get project updates (weekly summaries)
  @MessagePattern({ cmd: 'get_project_updates' })
  async getProjectUpdates(
    @Payload()
    payload: {
      projectId: number;
      page?: number;
      pageSize?: number;
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.getProjectUpdates(
      payload.projectId,
      payload.user,
      payload.page,
      payload.pageSize,
    );
  }

  // Document Management
  @MessagePattern({ cmd: 'add_project_document' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'CONTRACTOR')
  async addDocument(
    @Payload()
    payload: {
      projectId: number;
      dto: { title: string; url: string; fileType?: string; isVisibleToClient?: boolean };
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.addDocument(
      payload.projectId,
      payload.dto,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'get_project_documents' })
  async getDocuments(
    @Payload()
    payload: {
      projectId: number;
      page?: number;
      pageSize?: number;
      user: AuthenticatedUser;
    },
  ) {
    return await this.projectsService.getDocuments(
      payload.projectId,
      payload.user,
      payload.page,
      payload.pageSize,
    );
  }

  // Project Communication (Comments)
  @MessagePattern({ cmd: 'add_project_comment' })
  async addComment(
    @Payload()
    payload: {
      projectId: number;
      content: string;
      user: AuthenticatedUser;
    },
  ) {
    return await this.commentsService.create(
      payload.projectId,
      payload.content,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'get_project_comments' })
  async getComments(
    @Payload()
    payload: {
      projectId: number;
      user: AuthenticatedUser;
    },
  ) {
    return await this.commentsService.findByProject(
      payload.projectId,
      payload.user,
    );
  }
}
