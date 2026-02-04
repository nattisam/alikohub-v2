import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { AcademyProfileGuard } from './auth';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

dotenv.config(); // Load .env variables first

import { winstonConfig } from './winston.config';

async function bootstrap() {
  // Create Nest application instance
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  // Get ConfigService if needed
  const configService = app.get(ConfigService);

  // Use PORT from env or default 3005
  const PORT = parseInt(process.env.PORT as string) || 3005;

  // Connect TCP microservice
  app.connectMicroservice({
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
          queue: 'academy_user_events',
          exchange: 'user_events',
          exchangeType: 'fanout',
          queueOptions: {
            durable: false
          },
        },
      });
      console.log(`Academy: RabbitMQ transport configured for ${rabbitmqUrl}`);
    } catch (e) {
      console.warn(`Academy: RabbitMQ transport not available: ${e.message}`);
    }
  } else {
    console.log('Academy: RabbitMQ disabled via RABBITMQ_ENABLED=false');
  }

  // Centralized Global Error Handling
  app.useGlobalFilters(new RpcExceptionFilter());
  
  // Centralized Validation Handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Apply global guard
  app.useGlobalGuards(app.get(AcademyProfileGuard));

  // Start microservice listeners
  await app.startAllMicroservices();

  console.log(`Academy microservice listening on TCP port ${PORT}`);
}
bootstrap();
