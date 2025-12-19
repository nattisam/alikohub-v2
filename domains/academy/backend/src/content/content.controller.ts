import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UploadContentDto } from './dto/upload-content.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { ContentType } from '@prisma/client';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller()
@UseGuards(AcademyProfileGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern({ cmd: 'find_content_by_lesson' })
  async findByLesson(
    @Payload() payload: { lessonId: number; user: AuthenticatedUser },
  ) {
    return this.contentService.findByLesson(payload.lessonId, payload.user);
  }

  @MessagePattern({ cmd: 'create_content' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(
    @Payload() payload: { dto: CreateContentDto; user: AuthenticatedUser },
  ) {
    return this.contentService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'upload_content_file' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async uploadFile(
    @Payload()
    payload: {
      dto: UploadContentDto;
      file: UploadedFile;
      user: AuthenticatedUser;
    },
  ) {
    return this.contentService.uploadFile(
      payload.dto,
      payload.file,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'find_all_content' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async findAll(@Payload() payload: { user: AuthenticatedUser }) {
    return this.contentService.findAll(payload.user);
  }

  @MessagePattern({ cmd: 'find_content_by_id' })
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.contentService.findOne(payload);
  }

  @MessagePattern({ cmd: 'update_content' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async update(
    @Payload()
    payload: {
      id: number;
      dto: UpdateContentDto;
      user: AuthenticatedUser;
    },
  ) {
    return this.contentService.update(payload);
  }

  @MessagePattern({ cmd: 'remove_content' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.contentService.remove(payload);
  }

  @MessagePattern({ cmd: 'find_content_by_course' })
  async findByCourse(
    @Payload() payload: { courseId: number; user: AuthenticatedUser },
  ) {
    return this.contentService.findByCourse(payload);
  }

  @MessagePattern({ cmd: 'search_content' })
  async searchContent(
    @Payload()
    payload: {
      query: string;
      type?: ContentType;
      courseId?: number;
      user: AuthenticatedUser;
    },
  ) {
    return this.contentService.searchContent(payload);
  }
}
