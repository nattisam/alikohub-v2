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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('admin/events')
@UseGuards(AuthGuard)
export class EventsController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Post()
    createEvent(@Request() req: RequestWithUser, @Body() createEventDto: CreateEventDto) {
        console.log('Sending create event request with DTO:', JSON.stringify(createEventDto, null, 2));
        const payload = {
            dto: createEventDto,
            user: req.user,
        };
        console.log('Sending payload to events service:', JSON.stringify(payload, null, 2));
        return this.eventsClient.send({ cmd: 'create_event' }, payload);
    }

    @Put(':id')
    updateEvent(@Request() req: RequestWithUser, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        const payload = {
            id,
            dto: updateEventDto,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'update_event' }, payload);
    }

    @Delete(':id')
    removeEvent(@Request() req: RequestWithUser, @Param('id') id: string) {
        const payload = {
            id,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'remove_event' }, payload);
    }
}