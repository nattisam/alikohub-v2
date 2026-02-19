import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { PublicEventsController } from './public-events.controller';

@Module({
    controllers: [EventsController, PublicEventsController]
})
export class EventsModule { }