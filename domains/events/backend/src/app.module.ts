import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { UpdatesModule } from './updates/updates.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        EventsModule,
        RegistrationsModule,
        UpdatesModule,
        RolesModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }