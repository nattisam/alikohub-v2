import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { UpdatesModule } from './updates/updates.module';
import { RolesModule } from './roles/roles.module';
import { RouterModule } from '@nestjs/core';
import { EventsController } from './events-service.controller';

@Module({
    imports: [
        EventsModule,
        RegistrationsModule,
        UpdatesModule,
        RolesModule,
    ],
    controllers: [EventsController]
})
export class EventsServiceModule { }