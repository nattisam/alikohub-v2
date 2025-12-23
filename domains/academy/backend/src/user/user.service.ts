import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AcademyRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

enum GlobalRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type AuthenticatedUser = {
  firebaseId: string;
  globalRole: GlobalRole;
};

// Add this interface
// Update type definition
export type AcademyUserProfile = {
  id: number;
  userId: string;
  role: AcademyRole;
  hasSelectedRole: boolean;
  bio?: string | null;
  expertise?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  user?: any; // Enriched User Info
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    private prisma: PrismaService,
  ) { }

  // ... (getUserById / getUsersByIds methods remain same) ...
  async getUserById(userId: string) {
    try {
      this.logger.log(`Fetching user details for: ${userId} from Auth Service`);
      const payload = {
        firebaseId: userId,
      };

      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'get_user_profile' }, payload),
      );
      this.logger.log(`Received user details for ${userId}: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId}`, error);
      return null;
    }
  }

  async getUsersByIds(userIds: string[]) {
    try {
      // The payload is simple: an object with a 'userIds' property
      const payload = { userIds };

      const users = await firstValueFrom(
        this.authClient.send({ cmd: 'get_users_by_ids' }, payload),
      );
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users`, error);
      return []; // Return an empty array on failure
    }
  }

  async getOrCreateProfile(user: AuthenticatedUser): Promise<AcademyUserProfile> {
    let profile = await this.prisma.academyProfile.findUnique({
      where: { userId: user.firebaseId },
    });

    if (!profile) {
      const roleToAssign =
        user.globalRole === GlobalRole.ADMIN
          ? AcademyRole.ADMIN
          : AcademyRole.USER;
      profile = await this.prisma.academyProfile.create({
        data: {
          userId: user.firebaseId,
          role: roleToAssign,
          hasSelectedRole: false, // New users should see the role selection modal
        },
      });
    }

    // Fetch user details from Auth Service
    const authUser = await this.getUserById(user.firebaseId);

    // Return the profile, ensuring hasSelectedRole is properly set
    return {
      id: profile.id,
      userId: profile.userId,
      role: profile.role,
      hasSelectedRole: profile.hasOwnProperty('hasSelectedRole') ? profile.hasSelectedRole : false,
      bio: profile.bio,
      expertise: profile.expertise,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      user: authUser, // Attach the user details
    };
  }

  // Add this new method for role selection
  async selectRole(userId: string, role: AcademyRole) {
    try {
      const existingProfile = await this.prisma.academyProfile.findUnique({
        where: { userId }
      });

      if (existingProfile) {
        // Update the profile with the selected role and mark hasSelectedRole as true
        return await this.prisma.academyProfile.update({
          where: { userId },
          data: {
            role: role,
            hasSelectedRole: true
          },
        });
      } else {
        // Create a new profile with the selected role
        return await this.prisma.academyProfile.create({
          data: {
            userId: userId,
            role: role,
            hasSelectedRole: true
          },
        });
      }
    } catch (error) {
      this.logger.error('Error in selectRole:', error);
      throw error;
    }
  }
}