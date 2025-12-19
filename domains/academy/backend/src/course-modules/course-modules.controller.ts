import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';


@Controller()
@UseGuards(AcademyProfileGuard)
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) { }

  @MessagePattern({ cmd: 'create_course_module' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(@Payload() payload: { dto: CreateCourseModuleDto; user: AuthenticatedUser }) {
    return await this.courseModulesService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_modules_by_course' })
  async findAllByCourse(@Payload() payload: { courseId: number; user: AuthenticatedUser }) {
    return await this.courseModulesService.findAllByCourse(payload.courseId, payload.user);
  }

  @MessagePattern({ cmd: 'find_module_by_id' })
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.courseModulesService.findOne(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'update_course_module' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async update(@Payload() payload: { id: number; dto: UpdateCourseModuleDto; user: AuthenticatedUser }) {
    return await this.courseModulesService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'remove_course_module' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.courseModulesService.remove(payload.id, payload.user);
  }
}