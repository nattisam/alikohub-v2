import { Controller, UseGuards, Logger, UsePipes, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { EventsRole } from '@prisma/client';
import { UserService, AuthenticatedUser } from './user.service';
import { EventsProfileGuard } from '../auth/events-profile.guard';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { JoiValidationPipe } from '../validation.pipe';
import {
  GetEventsProfileSchema,
  UpdateUserRoleSchema,
  UserCreatedEventSchema
} from './user.validation';

@Controller()
@UseGuards(EventsProfileGuard)
@UseFilters(RpcExceptionFilter)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_events_profile' })
  @UsePipes(new JoiValidationPipe(GetEventsProfileSchema))
  async getProfile(@Payload() payload: { user: AuthenticatedUser }) {
    this.logger.log(`Fetching Events profile for user: ${payload.user.firebaseId}`);
    try {
      return await this.userService.getOrCreateProfile(payload.user);
    } catch (error) {
      this.logger.error(`Failed to fetch Events profile for user ${payload.user.firebaseId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'update_user_role' })
  @UsePipes(new JoiValidationPipe(UpdateUserRoleSchema))
  async updateRole(@Payload() payload: { userId: string; role: EventsRole; user: AuthenticatedUser }) {
    this.logger.log(`Updating role to ${payload.role} for user: ${payload.userId} (initiated by: ${payload.user.firebaseId})`);
    try {
      // Only admins can update roles
      const adminProfile = await this.userService.getOrCreateProfile(payload.user);
      if (adminProfile.role !== EventsRole.ADMIN) {
        throw new Error('Unauthorized: Only admins can update roles');
      }

      return await this.userService.updateRole(payload.userId, payload.role);
    } catch (error) {
      this.logger.error(`Failed to update role for user ${payload.userId} by admin ${payload.user.firebaseId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('user_created')
  @UsePipes(new JoiValidationPipe(UserCreatedEventSchema))
  async handleUserCreated(@Payload() payload: { userId: string; email: string; role: string; globalRole?: string }) {
    this.logger.log(`Handling user_created event for user: ${payload.userId} (${payload.email})`);
    try {
      const authenticatedUser: AuthenticatedUser = {
        firebaseId: payload.userId,
        email: payload.email,
        firstname: '',
        lastname: '',
        role: payload.role,
        globalRole: payload.globalRole,
        status: 'ACTIVE',
      };
      await this.userService.getOrCreateProfile(authenticatedUser);
      this.logger.log(`Successfully created Events profile for user: ${payload.userId}`);
    } catch (error) {
      this.logger.error(`Failed to handle user_created event for user ${payload.userId}: ${error.message}`, error.stack);
    }
  }
}
