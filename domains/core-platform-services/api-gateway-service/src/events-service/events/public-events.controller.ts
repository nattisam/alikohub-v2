import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreatePromotionRequestDto } from './dto/promotion-request.dto';

@Controller('events')
export class PublicEventsController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Get()
    @ApiOperation({ summary: 'Get all published events/announcements/news' })
    findAllPosts(@Query() query: any) {
        return this.eventsClient.send({ cmd: 'find_all_posts' }, { ...query, public: true });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific published post by ID' })
    findPostById(@Param('id') id: string) {
        return this.eventsClient.send({ cmd: 'find_one_post' }, { id, public: true });
    }

    @Post('promote')
    @ApiOperation({ summary: 'Submit a promotion request (public form)' })
    submitPromotionRequest(@Body() dto: CreatePromotionRequestDto) {
        return this.eventsClient.send({ cmd: 'submit_promotion_request' }, dto);
    }
}