import { Controller, UseGuards } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreateMilestoneReviewDto } from './dto/create-milestone-review.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';

@Controller()
@UseGuards(ConTechProfileGuard)
export class MilestonesController {
    constructor(private readonly milestonesService: MilestonesService) {}

    @MessagePattern({cmd: 'create_milestone'})
    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    create(@Payload() payload: { createMilestoneDto: CreateMilestoneDto; user: AuthenticatedUser }) {
        return this.milestonesService.create(payload.createMilestoneDto, payload.user);
    }

    @MessagePattern({cmd: 'findAll_milestones'})
    findAll(@Payload() payload: { projectId: number; user: AuthenticatedUser }) {
        return this.milestonesService.findAll(payload.projectId, payload.user);
    }

    @MessagePattern({cmd: 'findOne_milestones'})
    findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
        return this.milestonesService.findOne(payload.id, payload.user);
    }

    @MessagePattern({cmd: 'update_milestones'})
    @UseGuards(RoleGuard)
    @Roles('ADMIN', 'CONTRACTOR')
    update(@Payload() payload: { id: number; updateMilestoneDto: UpdateMilestoneDto; user: AuthenticatedUser }) {
        return this.milestonesService.update(payload.id, payload.updateMilestoneDto, payload.user);
    }

    @MessagePattern({cmd: 'remove_milestones'})
    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
        return this.milestonesService.remove(payload.id, payload.user);
    }

    @MessagePattern({cmd: 'submit_milestones'})
    @UseGuards(RoleGuard)
    @Roles('ADMIN', 'CONTRACTOR')
    submitForReview(@Payload() payload: { id: number; user: AuthenticatedUser }) {
        return this.milestonesService.submitForReview(payload.id, payload.user);
    }

}
