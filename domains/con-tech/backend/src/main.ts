import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { ConTechProfileGuard } from './auth';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

import { winstonConfig } from './winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
  const PORT = parseInt(process.env.PORT || '3002', 10);
  const configService = app.get(ConfigService);

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORT,
    },
  });

  // Add RabbitMQ transport for async events (optional - only if available)
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  if (process.env.RABBITMQ_ENABLED !== 'false') {
    try {
      app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: 'contech_user_events',
          exchange: 'user_events',
          exchangeType: 'fanout',
          queueOptions: {
            durable: false,
          },
          socketOptions: {
            noDelay: true,
          },
        },
      });
      console.log(`ConTech: RabbitMQ transport configured for ${rabbitmqUrl}`);
    } catch (e) {
      console.warn(`ConTech: RabbitMQ transport not available: ${e.message}`);
    }
  } else {
    console.log('ConTech: RabbitMQ disabled via RABBITMQ_ENABLED=false');
  }

  // Centralized Global Error Handling
  app.useGlobalFilters(new RpcExceptionFilter());

  // centralized Validation Handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Note: Guards are applied at controller level, not globally, to allow health checks

  await app.startAllMicroservices();
  const HTTP_PORT = 4002; // Separate port for health checks
  await app.listen(HTTP_PORT, '0.0.0.0');

  console.log(`ConTech microservice: TCP port ${PORT}, HTTP port ${HTTP_PORT}`);
}
bootstrap();
