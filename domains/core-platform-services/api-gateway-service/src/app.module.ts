import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RpcExceptionFilter } from './common/filters';
import { CaptchaModule } from './common/captcha/captcha.module';
import { UserModule } from './auth-service/user/user.module';
import { AcademyServiceModule } from './academy-service';

import { ConTechServiceModule } from './contech-service/contech-service.module';
import { EventsServiceModule } from './events-service/events-service.module';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TEST-06 Fix: Add global rate limiting - 10 requests per 60 seconds per IP
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds in milliseconds
      limit: 10, // 10 requests per ttl
    }]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
      },
      {
        name: 'ACADEMY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ACADEMY_SERVICE_HOST'),
            port: configService.get('ACADEMY_SERVICE_PORT'),
          },
        }),
      },
      {
        name: 'CONTECH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CONTECH_SERVICE_HOST'),
            port: configService.get('CONTECH_SERVICE_PORT'),
          },
        }),
      },
      {
        name: 'EVENTS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('EVENTS_SERVICE_HOST'),
            port: configService.get('EVENTS_SERVICE_PORT'),
          },
        }),
      },
      {
        name: 'CAREERS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CAREERS_SERVICE_HOST'),
            port: configService.get('CAREERS_SERVICE_PORT'),
          },
        }),
      },
    ]),
    CaptchaModule,
    UserModule,
    AcademyServiceModule,
    ConTechServiceModule,
    EventsServiceModule,
  ],
  providers: [
    // Global rate limiter guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ClientsModule],
})
export class AppModule { }

