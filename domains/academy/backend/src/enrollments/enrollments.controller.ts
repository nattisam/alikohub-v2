import { Controller, UseGuards, UsePipes, Logger } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import {
  CreateEnrollmentSchema,
  EnrollmentIdSchema,
  FindAllEnrollmentsSchema,
  CohortIdEnrollmentSchema,
  UserIdEnrollmentSchema,
  CourseIdEnrollmentSchema,
  UserOnlySchema,
} from './enrollments.validation';

@Controller()
@UseGuards(AcademyProfileGuard)
export class EnrollmentsController {
  private readonly logger = new Logger(EnrollmentsController.name);
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @MessagePattern({ cmd: 'create_enrollment' })
  @UsePipes(new JoiValidationPipe(CreateEnrollmentSchema))
  async create(
    @Payload() payload: { dto: CreateEnrollmentDto; user: AuthenticatedUser },
  ) {
    this.logger.log(
      `Enrolling user in course ID: ${payload.dto.courseId} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.enrollmentsService.create(payload.dto, payload.user);
    } catch (error) {
      this.logger.error(
        `Failed to create enrollment for course ID ${payload.dto.courseId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_all_enrollments' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @UsePipes(new JoiValidationPipe(FindAllEnrollmentsSchema))
  async findAll(@Payload() payload: { user: AuthenticatedUser; query?: any }) {
    this.logger.log(
      `Admin ${payload.user.firebaseId} is fetching all enrollments with query: ${JSON.stringify(payload.query)}`,
    );
    try {
      return await this.enrollmentsService.findAll(payload.user, payload.query);
    } catch (error) {
      this.logger.error(
        `Admin ${payload.user.firebaseId} failed to fetch all enrollments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_instructor_enrollments' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(FindAllEnrollmentsSchema))
  async findInstructorEnrollments(
    @Payload() payload: { user: AuthenticatedUser; query?: any },
  ) {
    this.logger.log(
      `Instructor ${payload.user.firebaseId} is fetching their student enrollments`,
    );
    try {
      return await this.enrollmentsService.findByInstructor(
        payload.user,
        payload.query,
      );
    } catch (error) {
      this.logger.error(
        `Instructor ${payload.user.firebaseId} failed to fetch their enrollments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_enrollments_by_cohort' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(CohortIdEnrollmentSchema))
  async findByCohort(
    @Payload()
    payload: {
      cohortId: number;
      user: AuthenticatedUser;
      query?: any;
    },
  ) {
    this.logger.log(
      `Fetching enrollments for cohort ID: ${payload.cohortId} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.enrollmentsService.findByCohort(
        payload.cohortId,
        payload.user,
        payload.query,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch enrollments for cohort ID ${payload.cohortId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'remove_enrollment' })
  @UsePipes(new JoiValidationPipe(EnrollmentIdSchema))
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    this.logger.log(
      `Removing enrollment ID: ${payload.id} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.enrollmentsService.remove(payload.id, payload.user);
    } catch (error) {
      this.logger.error(
        `Failed to remove enrollment ID ${payload.id} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_enrollments_by_user' })
  @UsePipes(new JoiValidationPipe(UserIdEnrollmentSchema))
  async findEnrollmentsByUser(
    @Payload() payload: { userId: string; user: AuthenticatedUser },
  ) {
    this.logger.log(
      `Fetching enrollments for user ID: ${payload.userId} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.enrollmentsService.findByUserId(
        payload.userId,
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch enrollments for user ID ${payload.userId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_my_enrollments' })
  @UsePipes(new JoiValidationPipe(UserOnlySchema))
  async findMyEnrollments(@Payload() payload: { user: AuthenticatedUser }) {
    this.logger.log(
      `User ${payload.user.firebaseId} is fetching their own enrollments`,
    );
    try {
      return await this.enrollmentsService.findMyEnrollments(payload.user);
    } catch (error) {
      this.logger.error(
        `User ${payload.user.firebaseId} failed to fetch their own enrollments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'find_enrollments_by_course' })
  @UsePipes(new JoiValidationPipe(CourseIdEnrollmentSchema))
  async findEnrollmentsByCourse(
    @Payload()
    payload: {
      courseId: number;
      user: AuthenticatedUser;
      query?: any;
    },
  ) {
    this.logger.log(
      `Fetching enrollments for course ID: ${payload.courseId} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.enrollmentsService.findByCourse(
        payload.courseId,
        payload.user,
        payload.query,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch enrollments for course ID ${payload.courseId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
