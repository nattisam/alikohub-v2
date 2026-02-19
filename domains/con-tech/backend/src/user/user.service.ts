import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { ContechRole } from '../generated/client';
import { firstValueFrom } from 'rxjs';

export type AuthenticatedUser = {
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  globalRole?: string;
  status: string;
  activeRole?: string;
};

export type ConTechUserProfile = {
  id: number;
  userId: string;
  role: ContechRole;
  hasSelectedRole: boolean;
  bio?: string | null;
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
    private prisma: PrismaService,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  async getOrCreateProfile(
    user: AuthenticatedUser,
  ): Promise<ConTechUserProfile> {
    await this.syncFromAuth(user.firebaseId);

    // Fetch fresh user data from Auth Service to ensure we have the latest details
    const authUser = await this.getUserById(user.firebaseId);
    // Fallback to the provided user object if fetch fails
    const effectiveUser = authUser || user;
    
    let profile = await this.prisma.contechProfile.findUnique({
      where: { userId: user.firebaseId },
    });

    if (!profile) {
      profile = await this.prisma.contechProfile.create({
        data: {
          userId: user.firebaseId,
          role: ContechRole.CLIENT,
          hasSelectedRole: false,
        },
      });
    }

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

    return this.prisma.contechProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        role: ContechRole.CLIENT,
        hasSelectedRole: false,
      },
    });
  }

  private async syncFromAuth(userId: string) {
    try {
      // Check if user has already selected a local ConTech role
      const existingProfile = await this.prisma.contechProfile.findUnique({
        where: { userId },
      });

      // Fetch the user's full profile from Auth Service to get globalRole
      const authUser: any = await this.getUserById(userId);
      
      // If the user has globalRole = ADMIN in Auth Service, sync as ADMIN in ConTech
      if (authUser?.globalRole === 'ADMIN') {
        await this.prisma.contechProfile.upsert({
          where: { userId },
          create: {
            userId,
            role: ContechRole.ADMIN,
            hasSelectedRole: true, // Mark as selected to prevent overwrite
          },
          update: {
            role: ContechRole.ADMIN,
            hasSelectedRole: true,
          },
        });
        this.logger.log(`User ${userId} is a Global ADMIN. Synced as ConTech ADMIN.`);
        return;
      }

      // If user has selected a role locally, don't overwrite it with Auth service data
      if (existingProfile?.hasSelectedRole) {
        this.logger.log(`User ${userId} has a locally selected role. Skipping sync from auth.`);
        return;
      }

      const authRecord: any = await firstValueFrom(
        this.authClient.send({ cmd: 'sync_contech_user' }, { userId }),
      );

      if (authRecord) {
        // Priority: 1. activeRole (if switched), 2. role (base role)
        const effectiveRole = authRecord.activeRole || authRecord.role;

        if (effectiveRole) {
          await this.prisma.contechProfile.upsert({
            where: { userId },
            create: {
              userId,
              role: effectiveRole as ContechRole,
              hasSelectedRole: !!authRecord.activeRole,
            },
            update: {
              role: effectiveRole as ContechRole,
              // If activeRole is present, update hasSelectedRole
              hasSelectedRole: authRecord.activeRole ? true : undefined,
            },
          });
          this.logger.log(`Synced user ${userId} from auth service. Role: ${effectiveRole}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to sync user ${userId} from auth service`, error);
    }
  }

  async getUserById(userId: string) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'get_user_profile' }, { firebaseId: userId }),
      );
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId}`, error);
      return null;
    }
  }

  async getUsersByIds(userIds: string[]) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'get_users_by_ids' }, { userIds }),
      );
    } catch (error) {
      this.logger.error('Failed to fetch multiple users', error);
      return [];
    }
  }

  async updateProfile(user: AuthenticatedUser, updateData: any) {
    const profile = await this.prisma.contechProfile.update({
      where: { userId: user.firebaseId },
      data: updateData,
    });

    return {
      ...profile,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      globalRole: user.globalRole,
      status: user.status,
    };
  }

  async selectRole(userId: string, role: ContechRole) {
    try {
      const existingProfile = await this.prisma.contechProfile.findUnique({
        where: { userId },
      });

      let updatedProfile;
      if (existingProfile) {
        updatedProfile = await this.prisma.contechProfile.update({
          where: { userId },
          data: { role, hasSelectedRole: true },
        });
      } else {
        updatedProfile = await this.prisma.contechProfile.create({
          data: { userId, role, hasSelectedRole: true },
        });
      }

      // Notify Auth service of the role change so JWT tokens are updated
      try {
        await firstValueFrom(
          this.authClient.send(
            { cmd: 'update_contech_role' },
            { userId, role }
          )
        );
        this.logger.log(`Notified Auth service of role change for user ${userId}`);
      } catch (error) {
        this.logger.error(`Failed to notify Auth service of role change for user ${userId}`, error);
        // Don't fail the operation if Auth service notification fails
      }

      return updatedProfile;
    } catch (error) {
      this.logger.error('Error in selectRole', error);
      throw error;
    }
  }

  async countByRole(role: ContechRole) {
    return this.prisma.contechProfile.count({
      where: { role },
    });
  }

  async findProfilesByRole(role: ContechRole, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    
    const [profiles, total] = await Promise.all([
      this.prisma.contechProfile.findMany({
        where: { role },
        skip,
        take: pageSize,
      }),
      this.prisma.contechProfile.count({ where: { role } }),
    ]);

    const userIds = profiles.map(p => p.userId);
    const authUsers = await this.getUsersByIds(userIds);

    const enrichedProfiles = profiles.map(profile => {
      const authUser = authUsers.find(au => au.firebaseId === profile.userId);
      return {
        ...profile,
        email: authUser?.email,
        firstname: authUser?.firstname,
        lastname: authUser?.lastname,
        status: authUser?.status,
      };
    });

    return {
      items: enrichedProfiles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
