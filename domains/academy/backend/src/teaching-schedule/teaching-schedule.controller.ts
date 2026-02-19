import { Controller, UseGuards, UsePipes, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeachingScheduleService } from './teaching-schedule.service';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { CreateTeachingScheduleDto, UpdateTeachingScheduleDto } from './dto';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import {
  InstructorOnlyScheduleSchema,
  CourseIdScheduleSchema,
  CreateTeachingScheduleSchema,
  UpdateTeachingScheduleSchema,
  ScheduleIdSchema,
} from './teaching-schedule.validation';

@Controller()
@UseGuards(AcademyProfileGuard)
export class TeachingScheduleController {
  private readonly logger = new Logger(TeachingScheduleController.name);
  constructor(
    private readonly teachingScheduleService: TeachingScheduleService,
  ) {}

  @MessagePattern({ cmd: 'get_instructor_schedules' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(InstructorOnlyScheduleSchema))
  async getInstructorSchedules(
    @Payload() payload: { user: AuthenticatedUser },
  ) {
    this.logger.log(
      `Instructor ${payload.user.firebaseId} fetching their teaching schedules`,
    );
    try {
      return await this.teachingScheduleService.getInstructorSchedules(
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Instructor ${payload.user.firebaseId} failed to fetch their teaching schedules: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_course_schedules' })
  @UseGuards(RoleGuard)
  @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(CourseIdScheduleSchema))
  async getCourseSchedules(
    @Payload() payload: { courseId: number; user: AuthenticatedUser },
  ) {
    this.logger.log(
      `Fetching schedules for course ID: ${payload.courseId} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.teachingScheduleService.getCourseSchedules(
        payload.courseId,
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch schedules for course ID ${payload.courseId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'create_teaching_schedule' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(CreateTeachingScheduleSchema))
  async createSchedule(
    @Payload()
    payload: {
      schedule: CreateTeachingScheduleDto;
      user: AuthenticatedUser;
    },
  ) {
    this.logger.log(
      `Creating teaching schedule "${payload.schedule.title}" for course ${payload.schedule.courseId} by: ${payload.user.firebaseId}`,
    );
    try {
      return await this.teachingScheduleService.createSchedule(
        payload.schedule,
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create teaching schedule "${payload.schedule.title}" by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'update_teaching_schedule' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(UpdateTeachingScheduleSchema))
  async updateSchedule(
    @Payload()
    payload: {
      scheduleId: number;
      updateData: UpdateTeachingScheduleDto;
      user: AuthenticatedUser;
    },
  ) {
    this.logger.log(
      `Updating teaching schedule ID: ${payload.scheduleId} by owner: ${payload.user.firebaseId}`,
    );
    try {
      return await this.teachingScheduleService.updateSchedule(
        payload.scheduleId,
        payload.updateData,
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update teaching schedule ID ${payload.scheduleId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'delete_teaching_schedule' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(ScheduleIdSchema))
  async deleteSchedule(
    @Payload() payload: { scheduleId: number; user: AuthenticatedUser },
  ) {
    this.logger.log(
      `Deleting teaching schedule ID: ${payload.scheduleId} by: ${payload.user.firebaseId}`,
    );
    try {
      return await this.teachingScheduleService.deleteSchedule(
        payload.scheduleId,
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete teaching schedule ID ${payload.scheduleId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_teaching_schedule' })
  @UseGuards(RoleGuard)
  @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
  @UsePipes(new JoiValidationPipe(ScheduleIdSchema))
  async getScheduleById(
    @Payload() payload: { scheduleId: number; user: AuthenticatedUser },
  ) {
    this.logger.log(
      `Fetching schedule details for ID: ${payload.scheduleId} (requested by: ${payload.user.firebaseId})`,
    );
    try {
      return await this.teachingScheduleService.getScheduleById(
        payload.scheduleId,
        payload.user,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch schedule details for ID ${payload.scheduleId} by user ${payload.user.firebaseId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
