import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { UserService, AuthenticatedUser, AcademyUserProfile } from './user.service';
import { AcademyRole } from '@prisma/client';

@Controller()
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: 'get_academy_profile' })
    async getProfile(@Payload() payload: { user: AuthenticatedUser }): Promise<AcademyUserProfile> {
        this.logger.log(`Received getProfile request for user: ${payload.user?.firebaseId}`);
        return await this.userService.getOrCreateProfile(payload.user);
    }

    @MessagePattern({ cmd: 'create_academy_profile' })
    async createProfile(@Payload() payload: { user: AuthenticatedUser }) {
        this.logger.log(`Received createProfile request for user: ${payload.user?.firebaseId}`);
        return await this.userService.getOrCreateProfile(payload.user);
    }

    // New method for role selection - matching ConTech pattern more closely
    @MessagePattern({ cmd: 'select_academy_role' })
    async selectRole(@Payload() payload: { user: any; userId: string; role: AcademyRole }) {
        this.logger.log(`Received selectRole request. Payload: ${JSON.stringify(payload)}`);

        // Extract userId and role from payload
        const userId = payload.userId;
        const role = payload.role;

        this.logger.log(`userId: ${userId}, role: ${role}`);

        try {
            this.logger.log(`Calling userService.selectRole for user: ${userId}, role: ${role}`);
            const result = await this.userService.selectRole(userId, role);
            this.logger.log(`Role selection successful for user: ${userId}, result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            this.logger.error(`Role selection failed for user: ${userId}`, error);
            throw error;
        }
    }

    @EventPattern('user_created')
    async handleUserCreated(@Payload() payload: { userId: string; email: string; role: string }) {
        this.logger.log(`Received user_created event for user: ${payload.userId}`);
        try {
            // Mapping global role to AcademyRole defaults if needed, though getOrCreateProfile handles it
            const authenticatedUser: AuthenticatedUser = {
                firebaseId: payload.userId,
                email: payload.email,
                firstname: '',
                lastname: '',
                role: payload.role,
                status: 'ACTIVE',
                globalRole: payload.role === 'ADMIN' ? 'ADMIN' : 'USER'
            };
            await this.userService.getOrCreateProfile(authenticatedUser);
            this.logger.log(`Academy profile ensured for user: ${payload.userId}`);
        } catch (error) {
            this.logger.error(`Failed to handle user_created event for user: ${payload.userId}`, error);
        }
    }
    
    @EventPattern('user_role_selected')
    async handleUserRoleSelected(@Payload() payload: { userId: string; role: string; hasSelectedRole: boolean }) {
        this.logger.log(`Received user_role_selected event for user: ${payload.userId}, role: ${payload.role}, hasSelectedRole: ${payload.hasSelectedRole}`);
        try {
            // Update the academy profile with the selected role
            await this.userService.selectRole(payload.userId, payload.role as AcademyRole);
            this.logger.log(`Updated academy profile for user: ${payload.userId} with role: ${payload.role}`);
        } catch (error) {
            this.logger.error(`Failed to handle user_role_selected event for user: ${payload.userId}`, error);
        }
    }
}