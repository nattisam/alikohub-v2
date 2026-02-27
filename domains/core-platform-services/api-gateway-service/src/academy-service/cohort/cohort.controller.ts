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
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Cohorts')
@Controller('academy/cohorts')
@UseGuards(AuthGuard)
export class CohortController {
  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) {}

  // Create cohort (Instructor only)
  @Post()
  @ApiOperation({
    summary: 'Create cohort',
    description: '🔒 Instructor only',
  })
  @ApiResponse({ status: 201, description: 'Cohort created successfully' })
  @ApiResponse({ status: 403, description: 'Instructor role required' })
  @ApiBody({ type: CreateCohortDto })
  createCohort(@Request() req: RequestWithUser, @Body() createCohortDto: CreateCohortDto) {
    const payload = {
      dto: createCohortDto,
      user: req.user,
    };
      return this.academyClient.send({ cmd: 'create_cohort' }, payload);
  }

  // Get all cohorts (optionally by course)
  @Get()
  @ApiOperation({ summary: 'Get all cohorts' })
  @ApiQuery({
    name: 'courseId',
    required: false,
    type: Number,
    description: 'Filter cohorts by course ID',
  })
  findAllCohorts(
    @Request() req: RequestWithUser,
    @Query() query: any,
  ) {
    const payload = { query, user: req.user };
    return this.academyClient.send({ cmd: 'find_all_cohorts' }, payload);
  }

  @Get('instructor/my')
  @ApiOperation({ summary: 'Get all cohorts for current instructor' })
  getMyCohorts(@Request() req: RequestWithUser, @Query() query: any) {
    return this.academyClient.send({ cmd: 'find_instructor_cohorts' }, { user: req.user, query });
  }

  // Get cohort by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get cohort by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Cohort ID',
  })
  findCohortById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
      return this.academyClient.send({ cmd: 'find_cohort_by_id' }, payload);
  }

  // Update cohort (Instructor only)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update cohort',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCohortDto })
  updateCohort(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCohortDto: UpdateCohortDto,
  ) {
    const payload = {
      id,
      dto: updateCohortDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'update_cohort' }, payload);
  }

  // Delete cohort (Instructor only)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete cohort',
    description: '🔒 Instructor only',
  })
  @ApiParam({ name: 'id', type: Number })
  removeCohort(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
      return this.academyClient.send({ cmd: 'remove_cohort' }, payload);
  }

  // Get cohorts by course
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get cohorts by course' })
  @ApiResponse({ status: 200, description: 'List of cohorts for a course' })
  @ApiParam({ name: 'courseId', type: Number })
  getCohortsByCourse(
    @Request() req: RequestWithUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const payload = { courseId, user: req.user };
    return this.academyClient.send({ cmd: 'get_cohorts_by_course' }, payload);
  }
}
