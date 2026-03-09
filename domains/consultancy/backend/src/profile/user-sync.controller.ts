import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProfileService } from './profile.service';

@Controller()
export class UserSyncController {
  private readonly logger = new Logger(UserSyncController.name);

  constructor(private readonly profileService: ProfileService) {}

  @EventPattern('user_created')
  async handleUserCreated(
    @Payload()
    payload: {
      userId: string;
      email: string;
      firstname: string;
      lastname?: string;
    },
  ) {
    this.logger.log(`Received user_created event for user: ${payload.userId}`);
    try {
      // Create a local profile for the new user
      await this.profileService.create({
        userId: payload.userId,
        // Since we don't have all Profile fields in the event, we use defaults or subset
        // The Profile model in schema.prisma has:
        // full_name, email, phone, bio, avatar_url, university, country, education_level, specialization
        fullName: `${payload.firstname} ${payload.lastname || ''}`.trim(),
        email: payload.email,
        bio: 'Consultancy profile auto-created',
      });
      this.logger.log(
        `Consultancy profile ensured for user: ${payload.userId}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to handle user_created event for user: ${payload.userId}: ${errorMessage}`,
      );
    }
  }
}
