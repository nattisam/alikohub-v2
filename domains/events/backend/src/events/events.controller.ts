import { Controller, HttpStatus, HttpCode, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JoiValidationPipe } from '../validation.pipe';
import { createEventSchema, updateEventSchema } from './events.schemas';
import { winstonLogger } from '../logger';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @MessagePattern({ cmd: 'find_all_events' })
    async findAll(@Payload() payload: { query: any; user: any }) {
        winstonLogger.info('RPC Call: find_all_events');
        return this.eventsService.findAll();
    }

    @MessagePattern({ cmd: 'find_event_by_id' })
    async findOne(@Payload() payload: { id: string; user: any }) {
        winstonLogger.info(`RPC Call: find_event_by_id - ID: ${payload.id}`);
        return this.eventsService.findOne(payload.id);
    }

    @MessagePattern({ cmd: 'create_event' })
    @UsePipes(new JoiValidationPipe(createEventSchema))
    async create(@Payload() payload: { dto: CreateEventDto; user: any }) {
        winstonLogger.info('RPC Call: create_event');
        return this.eventsService.create(payload.dto);
    }

    @MessagePattern({ cmd: 'update_event' })
    @UsePipes(new JoiValidationPipe(updateEventSchema))
    async update(@Payload() payload: { id: string; dto: UpdateEventDto; user: any }) {
        winstonLogger.info(`RPC Call: update_event - ID: ${payload.id}`);
        return this.eventsService.update(payload.id, payload.dto);
    }

    @MessagePattern({ cmd: 'remove_event' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Payload() payload: { id: string; user: any }) {
        winstonLogger.info(`RPC Call: remove_event - ID: ${payload.id}`);
        return this.eventsService.remove(payload.id);
    }
}