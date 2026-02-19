import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus, PostType, EventsRole } from '../generated/client';
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
    const profile = await this.userService.getProfileAndSync(user);

    if (!profile || (profile.role !== EventsRole.ADMIN && profile.role !== EventsRole.CONTENT_MANAGER)) {
      throw new ForbiddenException('Only Content Managers and Admins can create content.');
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

  async findAll(query: { type?: PostType; status?: PostStatus; page?: number; limit?: number; public?: boolean }) {
    const { type, status, page = 1, limit = 10, public: isPublic = false } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    
    // Public requests only see PUBLISHED content
    if (isPublic) {
      where.status = PostStatus.PUBLISHED;
    } else if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishDate: 'desc' },
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

  async findOne(id: string, isPublic = false) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    
    if (isPublic && post.status !== PostStatus.PUBLISHED) {
      throw new ForbiddenException('Post is not published');
    }
    
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: AuthenticatedUser) {
    const post = await this.findOne(id);
    const profile = await this.userService.getProfileAndSync(user);

    if (!profile) {
      throw new ForbiddenException('Permission denied.');
    }

    if (profile.role === EventsRole.ADMIN) {
      // Admins can update anything
    } else if (profile.role === EventsRole.CONTENT_MANAGER) {
      if (post.authorId !== user.firebaseId) {
        throw new ForbiddenException('You can only update your own drafts.');
      }
      if (post.status === PostStatus.PUBLISHED || post.status === PostStatus.APPROVED) {
        throw new ForbiddenException('Cannot edit a post once it has been approved or published.');
      }
    } else {
      throw new ForbiddenException('Permission denied.');
    }

    const updateData: any = { ...updatePostDto };
    if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate);

    // If CM updates a rejected post, it resets rejection reason
    if (profile.role === EventsRole.CONTENT_MANAGER && post.status === PostStatus.REJECTED) {
      updateData.rejectionReason = null;
    }

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
      data: { 
        status: PostStatus.PENDING,
        rejectionReason: null 
      },
    });
  }

  async review(id: string, status: PostStatus, rejectionReason: string | null, user: AuthenticatedUser) {
    const profile = await this.userService.getProfileAndSync(user);
    if (!profile || profile.role !== EventsRole.ADMIN) {
      throw new ForbiddenException('Only Admins can review and publish content.');
    }

    const data: any = { status };
    if (status === PostStatus.REJECTED) {
      data.rejectionReason = rejectionReason;
    } else if (status === PostStatus.PUBLISHED) {
      data.publishDate = new Date();
      data.rejectionReason = null;
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    const post = await this.findOne(id);
    const profile = await this.userService.getProfileAndSync(user);

    if (!profile || (profile.role !== EventsRole.ADMIN && post.authorId !== user.firebaseId)) {
      throw new ForbiddenException('Only the author or an Admin can delete this post.');
    }

    return this.prisma.post.delete({ where: { id } });
  }
}
