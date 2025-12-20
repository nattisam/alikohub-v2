import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Course Modules')
@Controller('academy/modules')
@UseGuards(AuthGuard)
export class CourseModuleController {
  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) {}

  // Create module (Instructor only – documented)
  @Post()
  @ApiOperation({
    summary: 'Create course module',
    description: '🔒 Instructor only',
  })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  @ApiResponse({ status: 403, description: 'Instructor role required' })
  @ApiBody({ type: CreateCourseModuleDto })
  createModule(@Request() req: RequestWithUser, @Body() createModuleDto: CreateCourseModuleDto) {
    const payload = {
      dto: createModuleDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'create_course_module' }, payload);
  }

  // Get modules by course
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get modules by course ID' })
  @ApiParam({
    name: 'courseId',
    type: Number,
    description: 'Course ID',
  })
  findAllModulesByCourse(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const payload = {
      courseId,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'find_modules_by_course' }, payload);
  }

  // Get module by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get module by ID' })
  @ApiParam({ name: 'id', type: Number })
  findModuleById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'find_module_by_id' }, payload);
  }

  // Update module
  @Put(':id')
  @ApiOperation({
    summary: 'Update course module',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCourseModuleDto })
  updateModule(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleDto: UpdateCourseModuleDto,
  ) {
    const payload = {
      id,
      dto: updateModuleDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'update_course_module' }, payload);
  }

  // Delete module
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete course module',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'id', type: Number })
  removeModule(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'remove_course_module' }, payload);
  }
}
