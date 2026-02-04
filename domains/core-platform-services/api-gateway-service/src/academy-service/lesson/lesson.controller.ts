import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('academy/lessons')
@UseGuards(AuthGuard)
export class LessonController {
  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) {}

  // Instructor
  @Post()
  @ApiOperation({
    summary: 'Create a lesson',
    description: '🔒 Instructor only',
  })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({ type: CreateLessonDto })
  createLesson(@Request() req: RequestWithUser, @Body() createLessonDto: CreateLessonDto) {
    const payload = {
      dto: createLessonDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'create_lesson' }, payload);
  }

  // Student / Instructor
  @Get('module/:moduleId')
  @ApiOperation({
    summary: 'Get lessons by module',
    description: 'Accessible to enrolled students and instructors',
  })
  @ApiParam({ name: 'moduleId', type: Number })
  findLessonsByModule(
    @Request() req: RequestWithUser,
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Query() query: any,
  ) {
    const payload = {
      moduleId,
      user: req.user,
      query,
    };
    return this.academyClient.send({ cmd: 'find_lessons_by_module' }, payload);
  }

  // Instructor only
  @Get('instructor/my')
  @ApiOperation({
    summary: 'Get all lessons for current instructor',
    description: '🔒 Instructor only',
  })
  @ApiResponse({ status: 200, description: 'List of lessons' })
  getMyLessons(@Request() req: RequestWithUser, @Query() query: any) {
    return this.academyClient.send({ cmd: 'find_instructor_lessons' }, { user: req.user, query });
  }

  // Student / Instructor
  @Get(':id')
  @ApiOperation({
    summary: 'Get lesson by ID',
  })
  @ApiParam({ name: 'id', type: Number })
  findLessonById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'find_lesson_by_id' }, payload);
  }

  // Instructor
  @Put(':id')
  @ApiOperation({
    summary: 'Update a lesson',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateLessonDto })
  updateLesson(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const payload = {
      id,
      dto: updateLessonDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'update_lesson' }, payload);
  }

  // Instructor
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a lesson',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'id', type: Number })
  removeLesson(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'remove_lesson' }, payload);
  }
}
