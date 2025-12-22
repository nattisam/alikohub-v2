import { Controller, HttpStatus, HttpCode } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @MessagePattern({ cmd: 'find_all_events' })
    async findAll(@Payload() payload: { query: any; user: any }) {
        return this.eventsService.findAll();
    }

    @MessagePattern({ cmd: 'find_event_by_id' })
    async findOne(@Payload() payload: { id: string; user: any }) {
        return this.eventsService.findOne(payload.id);
    }

    @MessagePattern({ cmd: 'create_event' })
    async create(@Payload() payload: { dto: CreateEventDto; user: any }) {
        return this.eventsService.create(payload.dto);
    }

    @MessagePattern({ cmd: 'update_event' })
    async update(@Payload() payload: { id: string; dto: UpdateEventDto; user: any }) {
        return this.eventsService.update(payload.id, payload.dto);
    }

    @MessagePattern({ cmd: 'remove_event' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Payload() payload: { id: string; user: any }) {
        return this.eventsService.remove(payload.id);
    }
}