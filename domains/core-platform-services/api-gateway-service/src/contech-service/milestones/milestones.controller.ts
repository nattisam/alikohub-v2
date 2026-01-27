import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Inject,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreateMilestoneReviewDto } from './dto/create-milestone-review.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';

@ApiTags('milestones')
@Controller('milestones')
@UseGuards(AuthGuard)
export class MilestonesController {
  constructor(@Inject('CONTECH_SERVICE') private contechClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create a new milestone' })
  @ApiBody({ type: CreateMilestoneDto })
  create(@Request() req: RequestWithUser, @Body() createMilestoneDto: CreateMilestoneDto) {
    const payload = { user: req.user, createMilestoneDto };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'create_milestone' }, payload),
    );
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all milestones for a project' })
  @ApiParam({ name: 'projectId', type: Number })
  findAll(@Request() req: RequestWithUser, @Param('projectId', ParseIntPipe) projectId: number) {
    const payload = { user: req.user, projectId };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'findAll_milestones' }, payload),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single milestone by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { user: req.user, id };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'findOne_milestones' }, payload),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a milestone by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMilestoneDto })
  update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    const payload = { user: req.user, id, updateMilestoneDto };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'update_milestones' }, payload),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a milestone by ID' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { user: req.user, id };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'remove_milestones' }, payload),
    );
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit milestone for review' })
  @ApiParam({ name: 'id', type: Number })
  submitForReview(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { user: req.user, id };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'submit_milestones' }, payload),
    );
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Create a review for a milestone' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateMilestoneReviewDto })
  createReview(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() createMilestoneReviewDto: CreateMilestoneReviewDto,
  ) {
    const payload = { user: req.user, createMilestoneReviewDto };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'create_milestone_review' }, payload),
    );
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get all reviews for a milestone' })
  @ApiParam({ name: 'id', type: Number })
  getReviewsForMilestone(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const payload = { user: req.user, id };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'getReviewsForMilestone' }, payload),
    );
  }
}
