import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { UserService, AuthenticatedUser, ConTechUserProfile } from './user.service';
import { ConTechProfileGuard } from '../auth';
import { ContechRole } from '@prisma/client';

@Controller()
@UseGuards(ConTechProfileGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: 'get_contech_profile' })
    async getProfile(@Payload() payload: { user: AuthenticatedUser }): Promise<ConTechUserProfile> {
        return await this.userService.getOrCreateProfile(payload.user);
    }

    @MessagePattern({ cmd: 'create_contech_profile' })
    async createProfile(@Payload() payload: { user: AuthenticatedUser }) {
        return await this.userService.getOrCreateProfile(payload.user);
    }

    @MessagePattern({ cmd: 'update_contech_profile' })
    async updateProfile(@Payload() payload: { user: AuthenticatedUser; updateData: any }) {
        return await this.userService.updateProfile(payload.user.firebaseId, payload.updateData);
    }

    @MessagePattern({ cmd: 'select_contech_role' })
    async selectRole(@Payload() payload: { userId: string; role: ContechRole }) {
        return await this.userService.selectRole(payload.userId, payload.role);
    }

    @EventPattern('user_created')
    async handleUserCreated(@Payload() payload: { userId: string; email: string; role: string }) {
        try {
            const authenticatedUser: AuthenticatedUser = {
                firebaseId: payload.userId,
                email: payload.email,
                firstName: '',
                lastName: '',
                role: payload.role,
                status: 'ACTIVE'
            };
            await this.userService.getOrCreateProfile(authenticatedUser);
        } catch (error) {
            console.error(`Failed to handle user_created event for user: ${payload.userId}`, error);
        }
    }
}