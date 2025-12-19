import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';
import { UserModule } from './auth-service/user/user.module';
import { AcademyServiceModule } from './academy-service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UserModule,
    AcademyServiceModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
  ],
  exports: [ClientsModule],
})
export class AppModule { }
