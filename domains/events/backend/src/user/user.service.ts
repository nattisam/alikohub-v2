import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsProfile, EventsRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../database/prisma.service';

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
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    private prisma: PrismaService,
  ) { }

  async getUserById(userId: string) {
    try {
      const payload = { firebaseId: userId };
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'get_user_profile' }, payload),
      );
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId}`, error);
      return null;
    }
  }

  async getOrCreateProfile(user: AuthenticatedUser): Promise<EventsProfile> {
    await this.syncFromAuth(user.firebaseId);

    let profile = await this.prisma.eventsProfile.findUnique({
      where: { id: user.firebaseId },
    });

    if (!profile) {
      const roleToAssign = user.globalRole === 'ADMIN' ? EventsRole.ADMIN : EventsRole.USER;
      profile = await this.prisma.eventsProfile.create({
        data: {
          id: user.firebaseId,
          role: roleToAssign,
        },
      });
    }

    return profile;
  }

  async updateRole(userId: string, role: EventsRole) {
    return this.prisma.eventsProfile.update({
      where: { id: userId },
      data: { role },
    });
  }

  private async syncFromAuth(userId: string) {
    try {
      const authRecord: any = await firstValueFrom(
        this.authClient.send({ cmd: 'sync_events_user' }, { userId }),
      );

      if (authRecord) {
        const effectiveRole = authRecord.role;

        if (effectiveRole) {
          await this.prisma.eventsProfile.upsert({
            where: { id: userId },
            create: {
              id: userId,
              role: effectiveRole as EventsRole,
            },
            update: {
              role: effectiveRole as EventsRole,
            },
          });
        }
      }
    } catch (error) {
      this.logger.warn(`Failed to sync user ${userId} from auth service`);
    }
  }
}
