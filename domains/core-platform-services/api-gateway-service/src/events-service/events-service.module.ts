import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { RolesModule } from './roles/roles.module';

@Module({
    imports: [
        EventsModule,
        RolesModule,
    ],
})
export class EventsServiceModule { }