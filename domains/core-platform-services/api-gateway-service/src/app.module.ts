import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CaptchaModule } from './common/captcha/captcha.module';
import { UserModule } from './auth-service/user/user.module';
import { AcademyServiceModule } from './academy-service';
import { ConTechServiceModule } from './contech-service/contech-service.module';
import { EventsServiceModule } from './events-service/events-service.module';
import { CareersServiceModule } from './careers-service/careers.module';
import { ConsultancyServiceModule } from './consultancy-service/consultancy.module';
import { FileUploadModule } from './file-upload-service/file-upload.module';
import { HealthModule } from './health/health.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpClientProxy } from './common/clients/http-client.proxy';
import { PaymentServiceModule } from './payment-service/payment.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10, 
    }]),
    ClientsModule.registerAsync([
      {
        name: 'ACADEMY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ACADEMY_SERVICE_HOST') || 'localhost',
            port: configService.get('ACADEMY_SERVICE_PORT') || 3005,
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
            host: configService.get('CONTECH_SERVICE_HOST') || 'localhost',
            port: configService.get('CONTECH_SERVICE_PORT') || 3002,
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
            host: configService.get('EVENTS_SERVICE_HOST') || 'localhost',
            port: configService.get('EVENTS_SERVICE_PORT') || 3004,
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
            host: configService.get('CAREERS_SERVICE_HOST') || 'localhost',
            port: Number(configService.get('CAREERS_SERVICE_PORT')) || 3008,
          },
        }),
      },
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST') || 'localhost',
            port: parseInt(configService.get('AUTH_TCP_PORT') || '3011', 10),
          },
        }),
      },
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENT_SERVICE_HOST') || 'localhost',
            port: Number(configService.get('PAYMENT_SERVICE_PORT')) || 3012,
          },
        }),
      },
      {
        name: 'CONSULTANCY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CONSULTANCY_SERVICE_HOST') || 'localhost',
            port: configService.get('CONSULTANCY_SERVICE_PORT') || 3006,
          },
        }),
      },
    ]),
    CaptchaModule,
    UserModule,
    AcademyServiceModule,
    ConTechServiceModule,
    EventsServiceModule,
    CareersServiceModule,
    ConsultancyServiceModule,
    FileUploadModule,
    PaymentServiceModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ClientsModule],
})
export class AppModule { }
