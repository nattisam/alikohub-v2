import { Controller, Logger, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import {
  UserService,
  AuthenticatedUser,
  AcademyUserProfile,
} from './user.service';
import { AcademyRole } from '../generated/client';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import {
  UserProfileSchema,
  SelectRoleSchema,
  UserCreatedEventSchema,
} from './user.validation';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_academy_profile' })
  @UsePipes(new JoiValidationPipe(UserProfileSchema))
  async getProfile(
    @Payload() payload: { user: AuthenticatedUser },
  ): Promise<AcademyUserProfile> {
    this.logger.log(
      `Received getProfile request for user: ${payload.user?.firebaseId}`,
    );
    try {
      return await this.userService.getOrCreateProfile(payload.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to get academy profile for user ${payload.user?.firebaseId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'create_academy_profile' })
  @UsePipes(new JoiValidationPipe(UserProfileSchema))
  async createProfile(@Payload() payload: { user: AuthenticatedUser }) {
    this.logger.log(
      `Received createProfile request for user: ${payload.user?.firebaseId}`,
    );
    try {
      return await this.userService.getOrCreateProfile(payload.user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to create academy profile for user ${payload.user?.firebaseId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  // New method for role selection - matching ConTech pattern more closely
  @MessagePattern({ cmd: 'select_academy_role' })
  @UsePipes(new JoiValidationPipe(SelectRoleSchema))
  async selectRole(
    @Payload()
    payload: {
      user: AuthenticatedUser;
      userId: string;
      role: AcademyRole;
    },
  ) {
    this.logger.log(
      `Received selectRole request for user: ${payload.userId} to role: ${payload.role}`,
    );

    const userId = payload.userId;
    const role = payload.role;

    try {
      const result = await this.userService.selectRole(userId, role);
      this.logger.log(`Role selection successful for user: ${userId}`);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Role selection failed for user: ${userId} to role ${role}: ${errorMessage}`,
      );
      throw error;
    }
  }

  @EventPattern('user_created')
  @UsePipes(new JoiValidationPipe(UserCreatedEventSchema))
  async handleUserCreated(
    @Payload() payload: { userId: string; email: string; role: string },
  ) {
    this.logger.log(`Received user_created event for user: ${payload.userId}`);
    try {
      const authenticatedUser: AuthenticatedUser = {
        firebaseId: payload.userId,
        email: payload.email,
        firstname: '',
        lastname: '',
        role: payload.role,
        status: 'ACTIVE',
        globalRole: payload.role === 'ADMIN' ? 'ADMIN' : 'USER',
      };
      await this.userService.getOrCreateProfile(authenticatedUser);
      this.logger.log(`Academy profile ensured for user: ${payload.userId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to handle user_created event for user: ${payload.userId}: ${errorMessage}`,
      );
    }
  }
}
