import { Controller, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { RoleGuard } from 'src/auth/role-guard/role-guard';


@Controller()
@UseGuards(AcademyProfileGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  @MessagePattern({ cmd: 'create_enrollment' })
  async create(@Payload() payload: { createEnrollmentDto: CreateEnrollmentDto; user: AuthenticatedUser }) {
    return await this.enrollmentsService.create(payload.createEnrollmentDto, payload.user);
  }

  @MessagePattern({ cmd: "find_all_enrollments" })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async findAll(@Payload() payload: { user: AuthenticatedUser }) {
    return await this.enrollmentsService.findAll(payload.user);
  }

  @MessagePattern({ cmd: "find_enrollments_by_cohort" })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async findByCohort(@Payload() payload: { cohortId: number; user: AuthenticatedUser }) {
    return await this.enrollmentsService.findByCohort(payload.cohortId, payload.user);
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
}