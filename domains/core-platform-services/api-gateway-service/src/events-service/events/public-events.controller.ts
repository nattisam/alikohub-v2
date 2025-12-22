import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { CreateRegistrationDto } from '../registrations/dto/create-registration.dto';

@Controller('events')
@UseGuards(AuthGuard)
export class PublicEventsController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Get()
    findAllEvents(@Request() req: RequestWithUser, @Query() query: any) {
        const payload = {
            query: query,
            user: req.user
        };
        return this.eventsClient.send({ cmd: 'find_all_events' }, payload);
    }

    @Get(':id')
    findEventById(@Request() req: RequestWithUser, @Param('id') id: string) {
        const payload = { id, user: req.user };
        return this.eventsClient.send({ cmd: 'find_event_by_id' }, payload);
    }

    @Post(':id/register')
    registerForEvent(@Request() req: RequestWithUser, @Param('id') id: string, @Body() createRegistrationDto: CreateRegistrationDto) {
        const payload = {
            eventId: id,
            dto: createRegistrationDto,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'create_registration' }, payload);
    }
}