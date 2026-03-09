import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentGuard } from './enrollment.guard';
import { PaymentFulfillmentListener } from './payment-fulfillment.listener';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENT_SERVICE_HOST') || 'payment-service',
            port: parseInt(configService.get('PAYMENT_SERVICE_PORT')) || 3012,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [EnrollmentsController, PaymentFulfillmentListener],
  providers: [EnrollmentsService, PrismaService, EnrollmentGuard],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
