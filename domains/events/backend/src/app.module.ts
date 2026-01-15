import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { UpdatesModule } from './updates/updates.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        EventsModule,
        RegistrationsModule,
        UpdatesModule,
        RolesModule,
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }