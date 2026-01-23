import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PromotionRequestsService } from './promotion-requests.service';
import { CreatePromotionRequestDto } from './dto/create-promotion-request.dto';
import { AuthenticatedUser } from '../user/user.service';
import { EventsProfileGuard } from '../auth/events-profile.guard';

@Controller()
export class PromotionRequestsController {
  constructor(private readonly service: PromotionRequestsService) {}

  @MessagePattern({ cmd: 'submit_promotion_request' })
  async create(@Payload() dto: CreatePromotionRequestDto) {
    return this.service.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_promotion_requests' })
  @UseGuards(EventsProfileGuard)
  async findAll(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.findAll(payload.user);
  }

  @MessagePattern({ cmd: 'mark_promotion_request_reviewed' })
  @UseGuards(EventsProfileGuard)
  async markAsReviewed(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    return this.service.markAsReviewed(payload.id, payload.user);
  }
}
