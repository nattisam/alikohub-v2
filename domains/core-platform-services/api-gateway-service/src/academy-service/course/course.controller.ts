import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseStatusDto } from './dto/update-course-status.dto';
import { AssignInstructorDto } from './dto/assign-instructor.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('academy/courses')
@UseGuards(AuthGuard)
export class CourseController {
  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) {}

  // Create a new course
  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({ type: CreateCourseDto })
  createCourse(@Request() req: RequestWithUser, @Body() createCourseDto: CreateCourseDto) {
    const payload = {
      dto: createCourseDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'create_course' }, payload);
  }

  // Get all courses
  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'List of courses' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query parameters (pagination, filters, etc.)',
  })
  findAllCourses(@Request() req: RequestWithUser, @Query() query: any) {
    const payload = {
      query,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'find_all_courses' }, payload);
  }

  // Get a course by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiParam({ name: 'id', type: Number })
  findCourseById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
    return this.academyClient.send({ cmd: 'find_course_by_id' }, payload);
  }

  // Update a course
  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCourseDto })
  updateCourse(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const payload = {
      id,
      dto: updateCourseDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'update_course' }, payload);
  }

  // Remove a course
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiParam({ name: 'id', type: Number })
  removeCourse(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'remove_course' }, payload);
  }

  // Update course status
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update course status' })
  @ApiResponse({ status: 200, description: 'Course status updated' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCourseStatusDto })
  updateCourseStatus(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCourseStatusDto,
  ) {
    const payload = {
      id,
      status: body.status,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'update_course_status' }, payload);
  }

  // Assign instructor
  @Patch(':id/instructor')
  @ApiOperation({ summary: 'Assign instructor to course' })
  @ApiResponse({
    status: 200,
    description: 'Instructor assigned successfully',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AssignInstructorDto })
  assignCourseInstructor(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignInstructorDto,
  ) {
    const payload = {
      id,
      instructorId: body.instructorId,
      user: req.user,
    };
    return this.academyClient.send(
      { cmd: 'assign_course_instructor' },
      payload,
    );
  }
}
