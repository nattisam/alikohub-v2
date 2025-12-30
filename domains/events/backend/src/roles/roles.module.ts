import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { DatabaseModule } from '../database/database.module';
import { RolesService } from './roles.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('AUTH_SERVICE_HOST'),
                        port: configService.get('AUTH_SERVICE_PORT') || 3001,
                    },
                }),
            }
        ]),
    ],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService]
})
export class RolesModule { }