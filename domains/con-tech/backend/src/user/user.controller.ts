import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

    // New method for role selection
    @MessagePattern({ cmd: 'select_contech_role' })
    async selectRole(@Payload() payload: { userId: string; role: ContechRole }) {
        console.log('selectRole called in UserController with payload:', payload);
        console.log('typeof payload.role:', typeof payload.role);
        console.log('payload.role value:', payload.role);
        console.log('ContechRole enum:', ContechRole);

        // Check if the role is a valid enum value
        const isValidRole = Object.values(ContechRole).includes(payload.role);
        console.log('Is valid role:', isValidRole);

        return await this.userService.selectRole(payload.userId, payload.role);
    }
}