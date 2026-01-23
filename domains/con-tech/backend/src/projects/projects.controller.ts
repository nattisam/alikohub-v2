import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';

@Controller()
@UseGuards(ConTechProfileGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern({ cmd: 'create_project' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
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
  @Roles('PROJECT_MANAGER', 'ADMIN')
  async findallcontractor(){
    return await this.projectsService.getContracrors()
  }

  @MessagePattern({cmd: 'find_inspector'})
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
  async findallinspector(){
    return await this.projectsService.getInspectors()
  }

  @MessagePattern({ cmd: 'update_project' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
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
  @Roles('PROJECT_MANAGER', 'ADMIN', 'CONTRACTOR')
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
  @Roles('PROJECT_MANAGER', 'ADMIN', 'CONTRACTOR')
  async updatePhotos(
    @Payload() payload: { id: number; photos: string[]; user: AuthenticatedUser },
  ) {
    return await this.projectsService.updatePhotos(payload.id, payload.photos, payload.user);
  }

  @MessagePattern({ cmd: 'get_project_stats' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
  async getStats(
    @Payload() payload: { manager?: string; user: AuthenticatedUser },
  ) {
    return await this.projectsService.getProjectStats(payload.manager);
  }
}
