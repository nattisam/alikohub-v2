import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePromotionRequestDto } from './dto/create-promotion-request.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';
import { EventsRole } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PromotionRequestsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  async create(dto: CreatePromotionRequestDto) {
    const request = await this.prisma.promotionRequest.create({
      data: dto,
    });

    // Notify Admin via Auth Service (Email)
    this.authClient.emit('send_contact_email', {
      name: dto.contactPerson,
      email: dto.email,
      subject: `New Promotion Request: ${dto.companyName}`,
      message: `Company: ${dto.companyName}\nContact: ${dto.contactPerson}\nPhone: ${dto.phoneNumber || 'N/A'}\n\nDetails: ${dto.description}`,
    });

    return request;
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
