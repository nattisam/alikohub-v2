import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { CreateTeachingScheduleDto, UpdateTeachingScheduleDto } from './dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { AuthenticatedUser, RequestWithUser } from '../../common/types/request-with-user.interface';

@ApiTags('Teaching Schedules')
@Controller('academy/teaching-schedules')
@UseGuards(AuthGuard)
export class TeachingScheduleController {
  private readonly logger = new Logger(TeachingScheduleController.name);

  constructor(
    @Inject('ACADEMY_SERVICE') private readonly academyClient: ClientProxy,
  ) {}

  private ensureUser(req: RequestWithUser): AuthenticatedUser {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    return req.user;
  }

  @Get('instructor')
  @ApiOperation({
    summary: 'Get schedules for the authenticated instructor',
    description: '🔒 Instructor / Admin only',
  })
  getInstructorSchedules(@Request() req: RequestWithUser) {
    const user = this.ensureUser(req);
    return this.academyClient.send(
      { cmd: 'get_instructor_schedules' },
      { user },
    );
  }

  @Get('course/:courseId')
  @ApiOperation({
    summary: 'Get all schedules for a specific course',
    description: 'Accessible by enrolled users, instructors, or admin',
  })
  @ApiParam({ name: 'courseId', type: Number })
  getCourseSchedules(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const user = this.ensureUser(req);
    return this.academyClient.send(
      { cmd: 'get_course_schedules' },
      { courseId, user },
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Create a teaching schedule',
    description: '🔒 Instructor / Admin only',
  })
  @ApiBody({ type: CreateTeachingScheduleDto })
  createSchedule(
    @Request() req: RequestWithUser,
    @Body() createScheduleDto: CreateTeachingScheduleDto,
  ) {
    this.logger.log(
      'API Gateway received schedule DTO:',
      JSON.stringify(createScheduleDto, null, 2),
    );
    const user = this.ensureUser(req);
    return this.academyClient.send(
      { cmd: 'create_teaching_schedule' },
      { schedule: createScheduleDto, user },
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Update a teaching schedule',
    description: '🔒 Instructor / Admin only',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTeachingScheduleDto })
  updateSchedule(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() updateData: UpdateTeachingScheduleDto,
  ) {
    const user = this.ensureUser(req);
    return this.academyClient.send(
      { cmd: 'update_teaching_schedule' },
      { scheduleId, updateData, user },
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a teaching schedule',
    description: '🔒 Instructor / Admin only',
  })
  @ApiParam({ name: 'id', type: Number })
  deleteSchedule(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    const user = this.ensureUser(req);
    return this.academyClient.send(
      { cmd: 'delete_teaching_schedule' },
      { scheduleId, user },
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a teaching schedule by ID',
    description: 'Accessible by instructor/admin or enrolled users',
  })
  @ApiParam({ name: 'id', type: Number })
  getScheduleById(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    const user = this.ensureUser(req);
    return this.academyClient.send(
      { cmd: 'get_teaching_schedule' },
      { scheduleId, user },
    );
  }
}
