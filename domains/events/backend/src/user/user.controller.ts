import { Controller, UseGuards, Logger } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { EventsRole } from '@prisma/client';
import { UserService, AuthenticatedUser } from './user.service';
import { EventsProfileGuard } from '../auth/events-profile.guard';

@Controller()
@UseGuards(EventsProfileGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_events_profile' })
  async getProfile(@Payload() payload: { user: AuthenticatedUser }) {
    return this.userService.getOrCreateProfile(payload.user);
  }

  @MessagePattern({ cmd: 'update_user_role' })
  async updateRole(@Payload() payload: { userId: string; role: EventsRole; user: AuthenticatedUser }) {
    // Only admins can update roles
    const adminProfile = await this.userService.getOrCreateProfile(payload.user);
    if (adminProfile.role !== EventsRole.ADMIN) {
      throw new Error('Unauthorized: Only admins can update roles');
    }

    return this.userService.updateRole(payload.userId, payload.role);
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() payload: { userId: string; email: string; role: string; globalRole?: string }) {
    try {
      this.logger.log(`Received user_created event for user: ${payload.userId}`);
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
      this.logger.error(`Failed to handle user_created event for user: ${payload.userId}`, error);
    }
  }
}
