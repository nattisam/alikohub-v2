import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { ContechRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

export type AuthenticatedUser = {
  firebaseId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  globalRole?: string;
  status: string;
};

export type ConTechUserProfile = {
  id: number;
  userId: string;
  role: ContechRole;
  hasSelectedRole: boolean;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
    let profile = await this.prisma.contechProfile.findUnique({
      where: { userId: user.firebaseId },
    });

    if (!profile) {
      profile = await this.prisma.contechProfile.create({
        data: {
          userId: user.firebaseId,
          role: ContechRole.USER,
          hasSelectedRole: false,
        },
      });
    }

    return {
      id: profile.id,
      userId: profile.userId,
      role: profile.role,
      hasSelectedRole: profile.hasSelectedRole,
      bio: profile.bio,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async getUserById(userId: string) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'get_user_by_id' }, { userId }),
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

  async updateProfile(userId: string, updateData: any) {
    return this.prisma.contechProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  async selectRole(userId: string, role: ContechRole) {
    try {
      const existingProfile = await this.prisma.contechProfile.findUnique({
        where: { userId },
      });

      if (existingProfile) {
        return this.prisma.contechProfile.update({
          where: { userId },
          data: { role, hasSelectedRole: true },
        });
      } else {
        return this.prisma.contechProfile.create({
          data: { userId, role, hasSelectedRole: true },
        });
      }
    } catch (error) {
      this.logger.error('Error in selectRole', error);
      throw error;
    }
  }
}
