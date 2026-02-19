import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RbacController } from './rbac.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from './roles/roles.guard';
import { EmailService } from './email.service';

import { JwtModule } from '@nestjs/jwt';
import { Argon2Service } from './argon2.service';


@Module({
  imports: [
    UserModule, 
    FirebaseModule, 
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.registerAsync([
      {
        name: 'ACADEMY_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ACADEMY_SERVICE_HOST') || 'localhost',
            port: configService.get('ACADEMY_SERVICE_PORT') || 3005,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CONTECH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('CONTECH_SERVICE_HOST') || 'localhost',
            port: configService.get('CONTECH_SERVICE_PORT') || 3002,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EVENTS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('EVENTS_SERVICE_HOST') || 'localhost',
            port: parseInt(configService.get('EVENTS_SERVICE_PORT')) || 3003,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController, RbacController],
  providers: [AuthService, RolesGuard, Argon2Service, EmailService],
  exports: [RolesGuard, Argon2Service, EmailService],
})
export class AuthModule {}

