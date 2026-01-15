import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';
import { Role } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

export type AuthenticatedUser = {
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  globalRole?: string;
  status: string;
};

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  async getOrCreateProfile(user: AuthenticatedUser) {
    await this.syncFromAuth(user.firebaseId);

    let profile = await this.prisma.eventsProfile.findUnique({
      where: { id: user.firebaseId },
    });

    if (!profile) {
      profile = await this.prisma.eventsProfile.create({
        data: {
          id: user.firebaseId,
          role: Role.USER,
        },
      });
    }

    return {
      ...profile,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      globalRole: user.globalRole,
      status: user.status,
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

  async syncFromAuth(userId: string) {
    try {
      await firstValueFrom(
        this.authClient.send({ cmd: 'sync_events_user' }, { userId }),
      );
    } catch (error) {
      this.logger.error(`Failed to sync user ${userId} from auth service`, error);
    }
  }

  async assignRole(userId: string, role: Role) {
    return this.prisma.eventsProfile.upsert({
      where: { id: userId },
      update: { role },
      create: { id: userId, role },
    });
  }

  async findProfileById(userId: string) {
    return this.prisma.eventsProfile.findUnique({
      where: { id: userId },
    });
  }
}
