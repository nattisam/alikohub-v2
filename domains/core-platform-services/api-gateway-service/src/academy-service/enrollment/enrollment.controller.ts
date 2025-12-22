import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { StudentAccessGuard, AdminAccessGuard } from '../../common/guards/academy-status.guard';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Enrollments')
@Controller('academy/enrollment')
@UseGuards(AuthGuard)
export class EnrollmentController {
  private readonly logger = new Logger(EnrollmentController.name);

  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) {}

  // Create enrollment (Student)
  @Post()
  @ApiOperation({
    summary: 'Enroll in a course',
    description: '👤 Student enrollment into a course or cohort',
  })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid enrollment data' })
  @ApiBody({ type: CreateEnrollmentDto })
  async createEnrollment(
    @Request() req: RequestWithUser,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    this.logger.log(
      `Creating enrollment. DTO: ${JSON.stringify(createEnrollmentDto)}, User: ${JSON.stringify(req.user)}`,
    );

    // ---- existing logic untouched ----
    console.log('Enrollment Controller - Raw request body:', req.body);

    if (
      createEnrollmentDto.courseId === undefined ||
      createEnrollmentDto.courseId === null
    ) {
      throw new BadRequestException('Course ID is required');
    }

    if (!Number.isInteger(createEnrollmentDto.courseId)) {
      throw new BadRequestException('Course ID must be an integer');
    }

    if (
      createEnrollmentDto.cohortId !== undefined &&
      createEnrollmentDto.cohortId !== null
    ) {
      if (!Number.isInteger(createEnrollmentDto.cohortId)) {
        throw new BadRequestException('Cohort ID must be an integer');
      }
    }

    const payload = {
      createEnrollmentDto,
      user: req.user,
    };

    return this.academyClient
      .send({ cmd: 'create_enrollment' }, payload)
      .toPromise();
  }

  // Admin / Instructor
  @Get()
  @ApiOperation({
    summary: 'Get all enrollments',
    description: '🔒 Admin / Instructor',
  })
  findAllEnrollments(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.academyClient.send({ cmd: 'find_all_enrollments' }, payload);
  }

  // Student
  @Get('me')
  @ApiOperation({ summary: 'Get my enrollments' })
  findMyEnrollments(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.academyClient.send({ cmd: 'find_my_enrollments' }, payload);
  }

  // Student
  @Get('my-courses')
  @ApiOperation({ summary: 'Get my enrolled courses' })
  findMyCourses(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.academyClient.send({ cmd: 'find_my_enrollments' }, payload);
  }

  // Instructor
  @Get('cohort/:cohortId')
  @ApiOperation({
    summary: 'Get enrollments by cohort',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'cohortId', type: Number })
  findEnrollmentsByCohort(
    @Request() req: RequestWithUser,
    @Param('cohortId', ParseIntPipe) cohortId: number,
  ) {
    const payload = { cohortId, user: req.user };
    return this.academyClient.send(
      { cmd: 'find_enrollments_by_cohort' },
      payload,
    );
  }

  // Admin
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove enrollment',
    description: '🔒 Admin only',
  })
  @ApiParam({ name: 'id', type: Number })
  removeEnrollment(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
    return this.academyClient.send({ cmd: 'remove_enrollment' }, payload);
  }

  // Admin
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get enrollments by user ID',
    description: '🔒 Admin only',
  })
  @ApiParam({ name: 'userId', type: String })
  findEnrollmentsByUserId(@Request() req: RequestWithUser, @Param('userId') userId: string) {
    const payload = { userId, user: req.user };
    return this.academyClient.send(
      { cmd: 'find_enrollments_by_user' },
      payload,
    );
  }

  // Get enrollments by course
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get enrollments by course' })
  @ApiResponse({ status: 200, description: 'List of enrollments for a course' })
  @ApiParam({ name: 'courseId', type: Number })
  getEnrollmentsByCourse(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const payload = { courseId, user: req.user };
    return this.academyClient.send({ cmd: 'get_enrollments_by_course' }, payload);
  }

  // Get enrollments by cohort
  @Get('cohort/:cohortId')
  @ApiOperation({ summary: 'Get enrollments by cohort' })
  @ApiResponse({ status: 200, description: 'List of enrollments for a cohort' })
  @ApiParam({ name: 'cohortId', type: Number })
  getEnrollmentsByCohort(
    @Request() req: RequestWithUser,
    @Param('cohortId', ParseIntPipe) cohortId: number,
  ) {
    const payload = { cohortId, user: req.user };
    return this.academyClient.send({ cmd: 'get_enrollments_by_cohort' }, payload);
  }

  // Get my enrollments
  @Get('my')
  @ApiOperation({ summary: 'Get my enrollments' })
  @ApiResponse({ status: 200, description: 'List of user enrollments' })
  getMyEnrollments(@Request() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const payload = { userId: req.user.firebaseId, user: req.user };
    return this.academyClient.send({ cmd: 'get_my_enrollments' }, payload);
  }
}
