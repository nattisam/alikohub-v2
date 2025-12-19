import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UploadContentDto } from './dto/upload-content.dto';
import { AuthenticatedUser, UserService } from 'src/user/user.service';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ContentType } from '@prisma/client';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    @Inject('FILE_UPLOAD_SERVICE')
    private readonly fileUploadClient: ClientProxy,
  ) {}

  async create(dto: CreateContentDto, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    const isInstructor = lesson.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin)
      throw new ForbiddenException(
        'You do not have permission to add content to this lesson.',
      );

    return this.prisma.content.create({ data: dto });
  }

  async uploadFile(
    dto: UploadContentDto,
    file: UploadedFile,
    user: AuthenticatedUser,
  ) {
    const academyProfile = await this.userService.getOrCreateProfile(user);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    const isInstructor = lesson.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin)
      throw new ForbiddenException(
        'You do not have permission to add content to this lesson.',
      );

    const allowedTypes = this.getAllowedFileTypes(dto.type);
    if (!allowedTypes.includes(file.mimetype))
      throw new BadRequestException(
        `Invalid file type. Allowed types for ${dto.type}: ${allowedTypes.join(', ')}`,
      );

    try {
      const uploadPayload = {
        file: {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
        folder: `academy/courses/${lesson.module.courseId}/lessons/${dto.lessonId}`,
      };

      const uploadResponse = await firstValueFrom(
        this.fileUploadClient.send({ cmd: 'upload_file' }, uploadPayload),
      );

      return this.prisma.content.create({
        data: {
          title: dto.title,
          type: dto.type,
          url: uploadResponse.url,
          lessonId: dto.lessonId,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'File upload failed: ' + (error.message || 'Unknown error'),
      );
    }
  }

  private getAllowedFileTypes(contentType: ContentType): string[] {
    switch (contentType) {
      case 'VIDEO':
        return ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      case 'PDF':
        return ['application/pdf'];
      case 'QUIZ':
        return ['application/json'];
      case 'ASSIGNMENT':
        return [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];
      default:
        return ['application/octet-stream'];
    }
  }

  async findAll(user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user);
    if (academyProfile.role !== 'ADMIN')
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );

    return this.prisma.content.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByLesson(lessonId: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    const isAdmin = academyProfile.role === 'ADMIN';
    const isInstructor = lesson.module.course.instructorId === user.firebaseId;

    // Check enrollment
    let isEnrolled = false;
    if (!isAdmin && !isInstructor) {
      const directEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId: user.firebaseId,
          courseId: lesson.module.courseId,
        },
      });

      const cohortEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId: user.firebaseId,
          cohort: { courseId: lesson.module.courseId },
        },
      });

      isEnrolled = !!directEnrollment || !!cohortEnrollment;
    }

    if (!isAdmin && !isInstructor && !isEnrolled)
      throw new ForbiddenException(
        'You must be enrolled in this course to view its content.',
      );

    return this.prisma.content.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(payload: { id: number; user: AuthenticatedUser }) {
    const content = await this.prisma.content.findUnique({
      where: { id: payload.id },
    });
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async update(payload: {
    id: number;
    dto: UpdateContentDto;
    user: AuthenticatedUser;
  }) {
    const academyProfile = await this.userService.getOrCreateProfile(
      payload.user,
    );

    const content = await this.prisma.content.findUnique({
      where: { id: payload.id },
      include: {
        lesson: { include: { module: { include: { course: true } } } },
      },
    });

    if (!content) throw new NotFoundException('Content not found');

    const isInstructor =
      content.lesson.module.course.instructorId === payload.user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin)
      throw new ForbiddenException(
        'You do not have permission to update this content.',
      );

    return this.prisma.content.update({
      where: { id: payload.id },
      data: payload.dto,
    });
  }

  async remove(payload: { id: number; user: AuthenticatedUser }) {
    const academyProfile = await this.userService.getOrCreateProfile(
      payload.user,
    );

    const content = await this.prisma.content.findUnique({
      where: { id: payload.id },
      include: {
        lesson: { include: { module: { include: { course: true } } } },
      },
    });

    if (!content) throw new NotFoundException('Content not found');

    const isInstructor =
      content.lesson.module.course.instructorId === payload.user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin)
      throw new ForbiddenException(
        'You do not have permission to delete this content.',
      );

    return this.prisma.content.delete({ where: { id: payload.id } });
  }

  async findByCourse(payload: { courseId: number; user: AuthenticatedUser }) {
    const academyProfile = await this.userService.getOrCreateProfile(
      payload.user,
    );

    const course = await this.prisma.course.findUnique({
      where: { id: payload.courseId },
      include: {
        modules: {
          include: {
            lessons: { include: { contents: true } },
          },
        },
      },
    });

    if (!course) throw new NotFoundException('Course not found');

    const isAdmin = academyProfile.role === 'ADMIN';
    if (!isAdmin) throw new ForbiddenException('You do not have permission.');

    return course.modules.flatMap((m) => m.lessons.flatMap((l) => l.contents));
  }

  async searchContent(payload: {
    query: string;
    type?: ContentType;
    courseId?: number;
    user: AuthenticatedUser;
  }) {
    const academyProfile = await this.userService.getOrCreateProfile(
      payload.user,
    );

    const isAdmin = academyProfile.role === 'ADMIN';
    const whereClause: any = {
      title: { contains: payload.query, mode: 'insensitive' },
    };
    if (payload.type) whereClause.type = payload.type;
    if (payload.courseId)
      whereClause.lesson = { module: { courseId: payload.courseId } };

    if (!isAdmin) {
      // Add enrollment checks if needed
    }

    return this.prisma.content.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }
}
