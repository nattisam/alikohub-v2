import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus, PostType } from '@prisma/client';
import { AuthenticatedUser } from '../user/user.service';
import { EventsProfileGuard } from '../auth/events-profile.guard';

@Controller()
@UseGuards(EventsProfileGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern({ cmd: 'create_post' })
  async create(@Payload() payload: { dto: CreatePostDto; user: AuthenticatedUser }) {
    return this.postsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_all_posts' })
  async findAll(@Payload() query: { type?: PostType; status?: PostStatus; page?: number; limit?: number }) {
    return this.postsService.findAll(query);
  }

  @MessagePattern({ cmd: 'find_post_by_id' })
  async findOne(@Payload() id: string) {
    return this.postsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_post' })
  async update(@Payload() payload: { id: string; dto: UpdatePostDto; user: AuthenticatedUser }) {
    return this.postsService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'submit_post_for_review' })
  async submitForReview(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    return this.postsService.submitForReview(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'review_post' })
  async review(@Payload() payload: { id: string; status: PostStatus; rejectionReason?: string; user: AuthenticatedUser }) {
    return this.postsService.review(payload.id, payload.status, payload.rejectionReason || null, payload.user);
  }

  @MessagePattern({ cmd: 'remove_post' })
  async remove(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    return this.postsService.remove(payload.id, payload.user);
  }
}
