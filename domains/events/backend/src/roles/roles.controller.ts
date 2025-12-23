import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';

@Controller('roles')
export class RolesController {
    constructor(private prisma: PrismaService) { }

    @MessagePattern({ cmd: 'assign_role' })
    async assignRole(@Payload() payload: any) {
        const { dto, user } = payload;

        // Validate the requested role
        const validRoles = ['USER', 'ATTENDEE', 'ORGANIZER', 'SPONSOR', 'ADMIN'];
        if (!dto.requestedRole || !validRoles.includes(dto.requestedRole)) {
            return {
                success: false,
                message: 'Invalid role requested'
            };
        }

        try {
            const updatedUser = await this.prisma.eventsProfile.upsert({
                where: { id: user.firebaseId },
                update: { role: dto.requestedRole },
                create: {
                    id: user.firebaseId,
                    role: dto.requestedRole
                }
            });

            return {
                success: true,
                message: 'Role assigned successfully',
                data: {
                    role: updatedUser.role
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
            const existingUser = await this.prisma.eventsProfile.findUnique({
                where: { id: user.firebaseId }
            });

            if (existingUser) {
                return {
                    success: true,
                    data: {
                        role: existingUser.role
                    }
                };
            } else {
                return {
                    success: true,
                    data: {
                        role: null
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
        console.log(`Received user_created event for user: ${payload.userId}`);
        try {
            await this.prisma.eventsProfile.upsert({
                where: { id: payload.userId },
                update: {},
                create: {
                    id: payload.userId,
                    role: 'USER'
                }
            });
            console.log(`Events profile ensured for user: ${payload.userId}`);
        } catch (error) {
            console.error(`Failed to handle user_created event for user: ${payload.userId}`, error);
        }
    }
}