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
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  globalRole?: string;
  status: string;
};

export type AcademyUserProfile = {
  id: number;
  userId: string;
  role: AcademyRole;
  hasSelectedRole: boolean;
  bio?: string | null;
  expertise?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstname: string;
  lastname: string;
  globalRole?: string;
  status: string;
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
    await this.syncFromAuth(user.firebaseId);

    // Fetch fresh user data from Auth Service to ensure we have the latest details
    const authUser = await this.getUserById(user.firebaseId);
    // Fallback to the provided user object if fetch fails
    const effectiveUser = authUser || user;

    let profile = await this.prisma.academyProfile.findUnique({
      where: { userId: user.firebaseId },
    });

    if (!profile) {
      const roleToAssign =
        user.globalRole === 'ADMIN'
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

    // Return the profile with enriched user data
    return {
      ...profile,
      email: effectiveUser.email,
      firstname: effectiveUser.firstname,
      lastname: effectiveUser.lastname,
      globalRole: effectiveUser.globalRole,
      status: effectiveUser.status,
    };
  }

  async ensureProfileExists(userId: string) {
    const authUser = await this.getUserById(userId);
    if (!authUser) return null;

    await this.syncFromAuth(userId);

    return this.prisma.academyProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        role: AcademyRole.USER,
        hasSelectedRole: false,
      },
    });
  }

  private async syncFromAuth(userId: string) {
    try {
      this.logger.log(`[UserService] Syncing user ${userId} from Auth service...`);
      const authRecord = await firstValueFrom(
        this.authClient.send({ cmd: 'sync_academy_user' }, { userId }),
      );

      if (authRecord) {
        // Determine effective role: prioritize ADMIN > INSTRUCTOR > STUDENT > USER
        let effectiveRole = authRecord.activeRole || authRecord.role;
        
        // If the user is a global admin, they are an admin in Academy too
        if (authRecord.globalRole === 'ADMIN' || authRecord.role === 'ADMIN') {
          effectiveRole = 'ADMIN';
        } else if (authRecord.role === 'INSTRUCTOR') {
          // If approved as instructor, use it if not already admin
          effectiveRole = 'INSTRUCTOR';
        }
        
        this.logger.log(`[UserService] Auth record found for ${userId}. Role: ${authRecord.role}, GlobalRole: ${authRecord.globalRole}, Effective: ${effectiveRole}`);

        if (effectiveRole) {
          await this.prisma.academyProfile.upsert({
            where: { userId },
            create: {
              userId,
              role: effectiveRole as AcademyRole,
              hasSelectedRole: !!authRecord.activeRole,
            },
            update: {
              role: effectiveRole as AcademyRole,
              // If activeRole is present, we know a selection has been made
              hasSelectedRole: authRecord.activeRole ? true : undefined,
            },
          });
          this.logger.log(`[UserService] Successfully synced user ${userId}. Academy role set to: ${effectiveRole}`);
        } else {
          this.logger.warn(`[UserService] No role found in auth record for ${userId}`);
        }
      } else {
        this.logger.warn(`[UserService] No auth record returned for ${userId}`);
      }
    } catch (error) {
      this.logger.error(`[UserService] Failed to sync user ${userId} from auth service:`, error);
    }
  }

  // Add this new method for role selection
  async selectRole(userId: string, role: AcademyRole) {
    this.logger.log(`selectRole called for userId: ${userId}, role: ${role}`);
    try {
      const existingProfile = await this.prisma.academyProfile.findUnique({
        where: { userId }
      });

      this.logger.log(`Found existing profile: ${!!existingProfile}`);

      if (existingProfile) {
        // Update the profile with the selected role and mark hasSelectedRole as true
        this.logger.log(`Updating existing profile for user: ${userId}, new role: ${role}`);
        const result = await this.prisma.academyProfile.update({
          where: { userId },
          data: {
            role: role,
            hasSelectedRole: true
          },
        });
        this.logger.log(`Updated profile result: ${JSON.stringify(result)}`);
        return result;
      } else {
        // Create a new profile with the selected role
        this.logger.log(`Creating new profile for user: ${userId}, role: ${role}`);
        const result = await this.prisma.academyProfile.create({
          data: {
            userId: userId,
            role: role,
            hasSelectedRole: true
          },
        });
        this.logger.log(`Created profile result: ${JSON.stringify(result)}`);
        return result;
      }
    } catch (error) {
      this.logger.error('Error in selectRole:', error);
      throw error;
    }
  }
}