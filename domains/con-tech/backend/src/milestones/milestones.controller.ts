import { Controller } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreateMilestoneReviewDto } from './dto/create-milestone-review.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MilestonesController {
    constructor(private readonly milestonesService: MilestonesService) {}

    @MessagePattern({cmd: 'create_milestone'})
    create(@Payload() createMilestoneDto: CreateMilestoneDto) {
        return this.milestonesService.create(createMilestoneDto);
    }

    @MessagePattern({cmd: 'findAll_milestones'})
    findAll(@Payload() payload: { projectId: number }) {
        return this.milestonesService.findAll(payload.projectId);
    }

    @MessagePattern({cmd: 'findOne_milestones'})
    findOne(@Payload() payload: { id: number }) {
        return this.milestonesService.findOne(payload.id);
    }

    @MessagePattern({cmd: 'update_milestones'})
    update(@Payload() payload: { id: number; updateMilestoneDto: UpdateMilestoneDto }) {
        return this.milestonesService.update(payload.id, payload.updateMilestoneDto);
    }

    @MessagePattern({cmd: 'remove_milestones'})
    remove(@Payload() payload: { id: number }) {
        return this.milestonesService.remove(payload.id);
    }

    @MessagePattern({cmd: 'submit_milestones'})
    submitForReview(@Payload() payload: { id: number }) {
        return this.milestonesService.submitForReview(payload.id);
    }

    @MessagePattern({cmd: 'createReview'})
    createReview(@Payload() payload: { id: number; createMilestoneReviewDto: CreateMilestoneReviewDto }) {
        return this.milestonesService.createReview(payload.id, payload.createMilestoneReviewDto);
    }

    @MessagePattern({cmd: 'getReviewsForMilestone'})
    getReviewsForMilestone(@Payload() payload: { id: number }) {
        return this.milestonesService.getReviewsForMilestone(payload.id);
    }
}
