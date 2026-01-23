import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePromotionRequestDto } from './dto/create-promotion-request.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';
import { EventsRole } from '@prisma/client';

@Injectable()
export class PromotionRequestsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(dto: CreatePromotionRequestDto) {
    // This is a public request, no user validation needed for creation
    return this.prisma.promotionRequest.create({
      data: dto,
    });
  }

  async findAll(user: AuthenticatedUser) {
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role !== EventsRole.ADMIN) {
      throw new ForbiddenException('Only admins can view promotion requests.');
    }

    return this.prisma.promotionRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsReviewed(id: string, user: AuthenticatedUser) {
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role !== EventsRole.ADMIN) {
      throw new ForbiddenException('Only admins can mark requests as reviewed.');
    }

    const request = await this.prisma.promotionRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Request not found');

    return this.prisma.promotionRequest.update({
      where: { id },
      data: { status: 'REVIEWED' },
    });
  }
}
