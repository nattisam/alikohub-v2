import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus } from '@prisma/client';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';

@Controller()
@UseGuards(AcademyProfileGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @MessagePattern({ cmd: 'create_course' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(@Payload() payload: { dto: CreateCourseDto; user: AuthenticatedUser }) {
    return await this.coursesService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_all_courses' })
  async findAll(@Payload() payload: { query: any; user: AuthenticatedUser }) {
    return await this.coursesService.findAll(payload.query);
  }

  @MessagePattern({ cmd: 'find_course_by_id' })
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.coursesService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update_course' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async update(@Payload() payload: { id: number; dto: UpdateCourseDto; user: AuthenticatedUser }) {
    return await this.coursesService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'remove_course' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.coursesService.remove(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'update_course_status' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async updateStatus(@Payload() payload: { id: number; status: CourseStatus; user: AuthenticatedUser }) {
    return await this.coursesService.updateStatus(payload.id, payload.status, payload.user);
  }

  @MessagePattern({ cmd: 'assign_course_instructor' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async assignInstructor(@Payload() payload: { id: number; instructorId: string; user: AuthenticatedUser }) {
    return await this.coursesService.assignInstructor(payload.id, payload.instructorId, payload.user);
  }
}