import { Controller, Logger, UsePipes, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectsService } from '../projects/projects.service';
import { UserService } from '../user/user.service';
import { ContechRole } from '../generated/client';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AdminDashboardSchema, ListProfilesSchema } from './admin.validation';

@Controller()
@UseFilters(RpcExceptionFilter)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern({ cmd: 'get_admin_dashboard' })
  @UsePipes(new JoiValidationPipe(AdminDashboardSchema))
  async getDashboard(@Payload() payload: any) {
    const { user } = payload;
    this.logger.log(
      `Fetching admin dashboard data (requested by: ${user.firebaseId})`,
    );

    try {
      const profile = await this.userService.getOrCreateProfile(user);
      if (profile.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
      }

      const stats = await this.projectsService.getProjectStats(user);

      const [totalClients, totalContractors] = await Promise.all([
        this.userService.countByRole(ContechRole.CLIENT),
        this.userService.countByRole(ContechRole.CONTRACTOR),
      ]);

      return {
        projectStats: stats,
        users: {
          clients: totalClients,
          contractors: totalContractors,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch admin dashboard for user ${user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'list_contech_users' })
  @UsePipes(new JoiValidationPipe(ListProfilesSchema))
  async listUsers(@Payload() payload: any) {
    const { user, role, page, pageSize } = payload;
    this.logger.log(
      `Listing users with role: ${role || 'all'} (requested by admin: ${user.firebaseId})`,
    );

    try {
      const adminProfile = await this.userService.getOrCreateProfile(user);
      if (adminProfile.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
      }

      return await this.userService.findProfilesByRole(role, page, pageSize);
    } catch (error) {
      this.logger.error(
        `Failed to list users for admin ${user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
