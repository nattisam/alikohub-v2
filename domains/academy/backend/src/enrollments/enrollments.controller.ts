import { Controller, UseGuards, UsePipes } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';


@Controller()
@UseGuards(AcademyProfileGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @MessagePattern({ cmd: 'create_enrollment' })
  @UsePipes(new JoiValidationPipe(Joi.object({
    dto: Joi.object({
      courseId: Joi.number().integer().required(),
      cohortId: Joi.number().integer().optional().allow(null),
      userId: Joi.string().optional()
    }).required(),
    user: Joi.object().unknown(true).required()
  })))
  async create(@Payload() payload: { dto: CreateEnrollmentDto; user: AuthenticatedUser }) {
    return await this.enrollmentsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: "find_all_enrollments" })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async findAll(@Payload() payload: { user: AuthenticatedUser; query?: any }) {
    return await this.enrollmentsService.findAll(payload.user, payload.query);
  }

  @MessagePattern({ cmd: 'find_instructor_enrollments' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async findInstructorEnrollments(@Payload() payload: { user: AuthenticatedUser; query?: any }) {
    return await this.enrollmentsService.findByInstructor(payload.user, payload.query);
  }

  @MessagePattern({ cmd: "find_enrollments_by_cohort" })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async findByCohort(@Payload() payload: { cohortId: number; user: AuthenticatedUser; query?: any }) {
    return await this.enrollmentsService.findByCohort(payload.cohortId, payload.user, payload.query);
  }

  @MessagePattern({ cmd: "remove_enrollment" })
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return await this.enrollmentsService.remove(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'find_enrollments_by_user' })
  async findEnrollmentsByUser(@Payload() payload: { userId: string; user: AuthenticatedUser }) {
    return await this.enrollmentsService.findByUserId(payload.userId, payload.user);
  }

  @MessagePattern({ cmd: 'find_my_enrollments' })
  async findMyEnrollments(@Payload() payload: { user: AuthenticatedUser }) {
    return await this.enrollmentsService.findMyEnrollments(payload.user);
  }

  @MessagePattern({ cmd: 'find_enrollments_by_course' })
  async findEnrollmentsByCourse(@Payload() payload: { courseId: number; user: AuthenticatedUser; query?: any }) {
    return await this.enrollmentsService.findByCourse(payload.courseId, payload.user, payload.query);
  }
}