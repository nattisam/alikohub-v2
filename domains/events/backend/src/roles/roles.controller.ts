import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('roles')
export class RolesController {
    constructor(private prisma: PrismaService) { }

    @MessagePattern({ cmd: 'assign_role' })
    async assignRole(@Payload() payload: any) {
        const { dto, user } = payload;

        // Validate the requested role
        if (!dto.requestedRole || !['USER', 'ORGANIZER'].includes(dto.requestedRole)) {
            return {
                success: false,
                message: 'Invalid role requested'
            };
        }

        try {
            // Create or update the user's role in the events database
            const updatedUser = await this.prisma.user.upsert({
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
            // Retrieve the user's role from the events database
            const existingUser = await this.prisma.user.findUnique({
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
                // User doesn't have a role assigned yet
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
}