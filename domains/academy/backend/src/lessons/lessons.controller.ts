import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { RoleGuard } from 'src/auth/role-guard/role-guard';


@Controller()
@UseGuards(AcademyProfileGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @MessagePattern({ cmd: 'create_lesson' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(@Payload() payload: { dto: CreateLessonDto; user: AuthenticatedUser }) {
    return await this.lessonsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_lessons_by_module' })
  async findByModule(@Payload() payload: { moduleId: number; user: AuthenticatedUser; query?: any }) {
    return await this.lessonsService.findByModule(payload.moduleId, payload.user, payload.query);
  }

  @MessagePattern({ cmd: 'find_instructor_lessons' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async findInstructorLessons(@Payload() payload: { user: AuthenticatedUser; query?: any }) {
    return await this.lessonsService.findByInstructor(payload.user, payload.query);
  }

  @MessagePattern({ cmd: 'find_lesson_by_id' })
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.lessonsService.findOne(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'update_lesson' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async update(@Payload() payload: { id: number; dto: UpdateLessonDto; user: AuthenticatedUser }) {
    return await this.lessonsService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'remove_lesson' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.lessonsService.remove(payload.id, payload.user);
  }
}