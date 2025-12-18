import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        academyUser: true,
        consultancyUser: true,
        contechUser: true,
        eventsUser: true,
      },
    });
  }

  async findByFirebaseId(firebaseId: string) {
    return this.prisma.user.findUnique({
      where: { firebaseId },
      include: {
        academyUser: true,
        consultancyUser: true,
        contechUser: true,
        eventsUser: true,
      },
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({
      data,
    });
  }
}
