import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { RolesService, AuthenticatedUser } from './roles.service';
import { Role } from '@prisma/client';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @MessagePattern({ cmd: 'get_events_profile' })
    async getProfile(@Payload() payload: { user: AuthenticatedUser }) {
        return this.rolesService.getOrCreateProfile(payload.user);
    }

    @MessagePattern({ cmd: 'assign_role' })
    async assignRole(@Payload() payload: any) {
        const { dto, user } = payload;
        const validRoles = Object.values(Role);
        
        if (!dto.requestedRole || !validRoles.includes(dto.requestedRole as Role)) {
            return {
                success: false,
                message: 'Invalid role requested'
            };
        }

        try {
            const updatedProfile = await this.rolesService.assignRole(user.firebaseId, dto.requestedRole as Role);

            return {
                success: true,
                message: 'Role assigned successfully',
                data: {
                    role: updatedProfile.role
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to assign role',
                error: error.message
            };
        }
    }

    @MessagePattern({ cmd: 'get_user_role' })
    async getUserRole(@Payload() payload: any) {
        const { user } = payload;

        try {
            const profile = await this.rolesService.findProfileById(user.firebaseId);

            if (profile) {
                return {
                    success: true,
                    data: {
                        role: profile.role
                    }
                };
            } else {
                // If profile doesn't exist, try to create/sync it
                const newProfile = await this.rolesService.getOrCreateProfile(user);
                return {
                    success: true,
                    data: {
                        role: newProfile.role
                    }
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve user role',
                error: error.message
            };
        }
    }

    @EventPattern('user_created')
    async handleUserCreated(@Payload() payload: { userId: string; email: string; role: string }) {
        try {
            const mockUser: AuthenticatedUser = {
                firebaseId: payload.userId,
                email: payload.email,
                firstname: '',
                lastname: '',
                role: payload.role,
                status: 'ACTIVE'
            };
            await this.rolesService.getOrCreateProfile(mockUser);
        } catch (error) {
            console.error(`Failed to handle user_created event for user: ${payload.userId}`, error);
        }
    }
}