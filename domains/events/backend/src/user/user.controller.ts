import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsRole } from '@prisma/client';
import { UserService, AuthenticatedUser } from './user.service';
import { EventsProfileGuard } from '../auth/events-profile.guard';

@Controller()
@UseGuards(EventsProfileGuard)
export class UserController {
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
}
