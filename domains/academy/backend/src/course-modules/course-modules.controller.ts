import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { RpcExceptionFilter } from 'src/common/filters/rpc-exception.filter';


@Controller()
@UseGuards(AcademyProfileGuard)
@UseFilters(RpcExceptionFilter)
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) { }

  @MessagePattern({ cmd: 'create_course_module' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(@Payload() payload: { dto: CreateCourseModuleDto; user: AuthenticatedUser }) {
    return await this.courseModulesService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_modules_by_course' })
  async findAllByCourse(@Payload() payload: { courseId: number; user: AuthenticatedUser; query?: any }) {
    return await this.courseModulesService.findAllByCourse(payload.courseId, payload.user, payload.query);
  }

  @MessagePattern({ cmd: 'find_module_by_id' })
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.courseModulesService.findOne(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'get_instructor_module' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async findOneForInstructor(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.courseModulesService.findOneForInstructor(payload.id, payload.user);
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