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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Internal Events Management')
@Controller('manage/events')
@UseGuards(AuthGuard)
export class EventsController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @ApiOperation({ summary: 'Create a new post (Draft)' })
    @Post()
    createPost(@Request() req: RequestWithUser, @Body() createPostDto: any) {
        return this.eventsClient.send({ cmd: 'create_post' }, { dto: createPostDto, user: req.user });
    }

    @ApiOperation({ summary: 'Get posts for management (supports filtering by status/type)' })
    @Get()
    findAllPosts(@Request() req: RequestWithUser, @Query() query: any) {
        return this.eventsClient.send({ cmd: 'find_all_posts' }, { ...query, user: req.user });
    }

    @ApiOperation({ summary: 'Update a draft or rejected post' })
    @Patch(':id')
    updatePost(@Request() req: RequestWithUser, @Param('id') id: string, @Body() updatePostDto: any) {
        return this.eventsClient.send({ cmd: 'update_post' }, { id, dto: updatePostDto, user: req.user });
    }

    @ApiOperation({ summary: 'Submit a draft for admin review' })
    @Post(':id/submit')
    submitForReview(@Request() req: RequestWithUser, @Param('id') id: string) {
        return this.eventsClient.send({ cmd: 'submit_post_for_review' }, { id, user: req.user });
    }

    @ApiOperation({ summary: 'Review a pending post (Approve/Publish/Reject)' })
    @Post(':id/review')
    reviewPost(@Request() req: RequestWithUser, @Param('id') id: string, @Body() body: { status: string; rejectionReason?: string }) {
        return this.eventsClient.send({ cmd: 'review_post' }, { id, status: body.status, rejectionReason: body.rejectionReason, user: req.user });
    }

    @ApiOperation({ summary: 'Delete a post' })
    @Delete(':id')
    removePost(@Request() req: RequestWithUser, @Param('id') id: string) {
        return this.eventsClient.send({ cmd: 'remove_post' }, { id, user: req.user });
    }

    // Promotion Requests Management
    @ApiOperation({ summary: 'Get all promotion requests (Admin only)' })
    @Get('promotions')
    findAllPromotionRequests(@Request() req: RequestWithUser) {
        return this.eventsClient.send({ cmd: 'find_all_promotion_requests' }, { user: req.user });
    }

    @ApiOperation({ summary: 'Mark a promotion request as reviewed (Admin only)' })
    @Patch('promotions/:id/review')
    markPromotionReviewed(@Request() req: RequestWithUser, @Param('id') id: string) {
        return this.eventsClient.send({ cmd: 'mark_promotion_request_reviewed' }, { id, user: req.user });
    }
}