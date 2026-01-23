import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus, PostType, EventsRole } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto, user: AuthenticatedUser) {
    const profile = await this.userService.getOrCreateProfile(user);

    if (profile.role !== EventsRole.ADMIN && profile.role !== EventsRole.CONTENT_MANAGER) {
      throw new ForbiddenException('Only Content Managers and Admins can create posts.');
    }

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: user.firebaseId,
        status: PostStatus.DRAFT,
        eventDate: createPostDto.eventDate ? new Date(createPostDto.eventDate) : null,
      },
    });
  }

  async findAll(query: { type?: PostType; status?: PostStatus; page?: number; limit?: number }) {
    const { type, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: AuthenticatedUser) {
    const post = await this.findOne(id);
    const profile = await this.userService.getOrCreateProfile(user);

    // Permissions check
    if (profile.role === EventsRole.ADMIN) {
      // Admins can update anything
    } else if (profile.role === EventsRole.CONTENT_MANAGER) {
      // Content Managers can only update their own drafts or rejected posts
      if (post.authorId !== user.firebaseId) {
        throw new ForbiddenException('You can only update your own posts.');
      }
      if (post.status === PostStatus.PUBLISHED || post.status === PostStatus.APPROVED) {
        throw new ForbiddenException('Cannot edit a post that is already approved or published.');
      }
    } else {
      throw new ForbiddenException('Permission denied.');
    }

    const updateData: any = { ...updatePostDto };
    if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate);

    // If a CM updates a rejected post, it should probably move back to DRAFT or stay REJECTED until submitted
    // But usually they just edit and then "submit". 

    return this.prisma.post.update({
      where: { id },
      data: updateData,
    });
  }

  async submitForReview(id: string, user: AuthenticatedUser) {
    const post = await this.findOne(id);
    if (post.authorId !== user.firebaseId) {
      throw new ForbiddenException('You can only submit your own posts.');
    }
    if (post.status !== PostStatus.DRAFT && post.status !== PostStatus.REJECTED) {
      throw new ForbiddenException('Only drafts or rejected posts can be submitted for review.');
    }

    return this.prisma.post.update({
      where: { id },
      data: { status: PostStatus.PENDING },
    });
  }

  async review(id: string, status: PostStatus, rejectionReason: string | null, user: AuthenticatedUser) {
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role !== EventsRole.ADMIN) {
      throw new ForbiddenException('Only admins can review posts.');
    }

    const data: any = { status };
    if (status === PostStatus.REJECTED) {
      data.rejectionReason = rejectionReason;
    } else if (status === PostStatus.PUBLISHED || status === PostStatus.APPROVED) {
      data.publishDate = new Date();
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    const post = await this.findOne(id);
    const profile = await this.userService.getOrCreateProfile(user);

    if (profile.role !== EventsRole.ADMIN && post.authorId !== user.firebaseId) {
      throw new ForbiddenException('Permission denied.');
    }

    return this.prisma.post.delete({ where: { id } });
  }
}
