import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PostStatus, PostType, EventsRole } from "../generated/client";
import { PrismaService } from "../database/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AuthenticatedUser, UserService } from "../user/user.service";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto, user: AuthenticatedUser) {
    const profile = await this.userService.getProfileAndSync(user);

    if (
      !profile ||
      (createPostDto.type !== PostType.SOCIAL_EVENT &&
        profile.role !== EventsRole.ADMIN &&
        profile.role !== EventsRole.CONTENT_MANAGER)
    ) {
      throw new ForbiddenException(
        "Only Content Managers and Admins can create professional content.",
      );
    }

    const status =
      createPostDto.type === PostType.SOCIAL_EVENT
        ? PostStatus.PUBLISHED
        : PostStatus.DRAFT;

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: user.firebaseId,
        status,
        eventDate: createPostDto.eventDate
          ? new Date(createPostDto.eventDate)
          : null,
        endEventDate: createPostDto.endEventDate
          ? new Date(createPostDto.endEventDate)
          : null,
      },
    });
  }

  async findAll(query: {
    type?: PostType;
    status?: PostStatus;
    authorId?: string;
    page?: number;
    limit?: number;
    public?: boolean;
    user?: AuthenticatedUser;
  }) {
    const {
      type,
      status,
      authorId,
      page = 1,
      limit = 10,
      public: isPublic = false,
      user,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;

    // Apply role-based filtering for non-public requests
    if (!isPublic && user) {
      const profile = await this.userService.getProfileAndSync(user);
      const isPrivileged =
        profile &&
        (profile.role === EventsRole.ADMIN ||
          profile.role === EventsRole.CONTENT_MANAGER);

      if (!isPrivileged) {
        // Regular users only see their own posts in management view
        where.authorId = user.firebaseId;
      } else if (authorId) {
        // Privileged users can filter by authorId if they want
        where.authorId = authorId;
      }
    } else if (authorId) {
      // For public requests, we still allow filtering by authorId if provided
      where.authorId = authorId;
    }

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
        orderBy: { publishDate: "desc" },
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
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        sessions: true,
        tickets: {
          where: { isActive: true },
        },
        sponsors: true,
        rsvps: !isPublic, // Only show RSVPs to admin/author
      },
    });

    if (!post) throw new NotFoundException("Post not found");

    if (isPublic && post.status !== PostStatus.PUBLISHED) {
      throw new ForbiddenException("Post is not published");
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: AuthenticatedUser,
  ) {
    const post = await this.findOne(id);
    const profile = await this.userService.getProfileAndSync(user);

    if (!profile) {
      throw new ForbiddenException("Permission denied.");
    }

    if (profile.role === EventsRole.ADMIN) {
      // Admins can update anything
    } else if (profile.role === EventsRole.CONTENT_MANAGER) {
      if (post.authorId !== user.firebaseId) {
        throw new ForbiddenException("You can only update your own drafts.");
      }
      if (
        post.status === PostStatus.PUBLISHED ||
        post.status === PostStatus.APPROVED
      ) {
        throw new ForbiddenException(
          "Cannot edit a post once it has been approved or published.",
        );
      }
    } else {
      throw new ForbiddenException("Permission denied.");
    }

    const updateData: any = { ...updatePostDto };
    if (updateData.eventDate)
      updateData.eventDate = new Date(updateData.eventDate);
    if (updateData.endEventDate)
      updateData.endEventDate = new Date(updateData.endEventDate);

    // If CM updates a rejected post, it resets rejection reason
    if (
      profile.role === EventsRole.CONTENT_MANAGER &&
      post.status === PostStatus.REJECTED
    ) {
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
      throw new ForbiddenException("You can only submit your own posts.");
    }

    if (
      post.status !== PostStatus.DRAFT &&
      post.status !== PostStatus.REJECTED
    ) {
      throw new ForbiddenException(
        "Only drafts or rejected posts can be submitted for review.",
      );
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.PENDING,
        rejectionReason: null,
      },
    });
  }

  async review(
    id: string,
    status: PostStatus,
    rejectionReason: string | null,
    user: AuthenticatedUser,
  ) {
    const profile = await this.userService.getProfileAndSync(user);
    if (!profile || profile.role !== EventsRole.ADMIN) {
      throw new ForbiddenException(
        "Only Admins can review and publish content.",
      );
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

    if (
      !profile ||
      (profile.role !== EventsRole.ADMIN && post.authorId !== user.firebaseId)
    ) {
      throw new ForbiddenException(
        "Only the author or an Admin can delete this post.",
      );
    }

    return this.prisma.post.delete({ where: { id } });
  }

  async getStats(user: AuthenticatedUser) {
    const profile = await this.userService.getProfileAndSync(user);
    if (!profile) throw new ForbiddenException("No events profile found.");

    const isInternal =
      profile.role === EventsRole.ADMIN ||
      profile.role === EventsRole.CONTENT_MANAGER;
    if (!isInternal) throw new ForbiddenException("Access denied.");

    const where: any = {};
    if (profile.role !== EventsRole.ADMIN) {
      where.authorId = user.firebaseId;
    }

    const events = await this.prisma.post.findMany({
      where,
      select: {
        id: true,
        type: true,
        registrations: {
          select: {
            totalPaid: true,
            isCheckedIn: true,
          },
        },
        rsvps: {
          select: {
            id: true,
          },
        },
      },
    });

    const stats = {
      proEvents: 0,
      socialEvents: 0,
      totalReg: 0,
      totalRsvp: 0,
      revenue: 0,
      checkedIn: 0,
    };

    events.forEach((e) => {
      if (e.type === PostType.EVENT) {
        stats.proEvents++;
      } else if (e.type === PostType.SOCIAL_EVENT) {
        stats.socialEvents++;
      }

      stats.totalReg += e.registrations.length;
      stats.totalRsvp += e.rsvps.length;
      stats.revenue += e.registrations.reduce(
        (sum, r) => sum + (r.totalPaid || 0),
        0,
      );
      stats.checkedIn += e.registrations.filter((r) => r.isCheckedIn).length;
    });

    return stats;
  }
}
