import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
            const result = await this.userService.selectRole(userId, role);
            this.logger.log(`Role selection successful for user: ${userId}`);
            return result;
        } catch (error) {
            this.logger.error(`Role selection failed for user: ${userId}`, error);
            throw error;
        }
    }
}