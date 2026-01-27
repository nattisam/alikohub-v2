import { Controller, Get, Query, UseGuards, Patch, Param, Body, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectsService } from '../projects/projects.service';
import { UserService } from '../user/user.service';
import { ContechRole } from '@prisma/client';

@Controller()
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: 'get_admin_dashboard' })
  async getDashboard(@Payload() payload: any) {
    const { user } = payload;
    
    // Check if user is ADMIN
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access required');
    }

    const stats = await this.projectsService.getProjectStats();
    
    // Additional admin-specific metrics
    const [totalClients, totalContractors] = await Promise.all([
      this.userService.countByRole(ContechRole.CLIENT),
      this.userService.countByRole(ContechRole.CONTRACTOR),
    ]);

    return {
      projectStats: stats,
      users: {
        clients: totalClients,
        contractors: totalContractors,
      }
    };
  }

  @MessagePattern({ cmd: 'list_contech_users' })
  async listUsers(@Payload() payload: any) {
    const { user, role, page, pageSize } = payload;
    
    const adminProfile = await this.userService.getOrCreateProfile(user);
    if (adminProfile.role !== 'ADMIN') {
      throw new Error('Unauthorized: Admin access required');
    }

    return this.userService.findProfilesByRole(role, page, pageSize);
  }
}
