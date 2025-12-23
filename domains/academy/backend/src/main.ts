import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { AcademyProfileGuard } from './auth';

dotenv.config(); // Load .env variables first

async function bootstrap() {
  // Create Nest application instance
  const app = await NestFactory.create(AppModule);

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

  // (Optional) RabbitMQ connection example
  // const rmqUrl = configService.get<string>('RABBITMQ_URL');
  // if (rmqUrl) {
  //   app.connectMicroservice({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [rmqUrl],
  //       queue: 'application_queue',
  //       noAck: true,
  //     },
  //   });
  //   console.log(`Academy microservice connecting to RabbitMQ at ${rmqUrl}`);
  // } else {
  //   console.warn('RABBITMQ_URL not found in environment, skipping RabbitMQ connection');
  // }
  

  // Apply global guard
  app.useGlobalGuards(app.get(AcademyProfileGuard));

  // Start microservice listeners
  await app.startAllMicroservices();

  console.log(
    `Academy microservice listening on TCP port ${PORT}` +
      ` and connected to RabbitMQ if configured`,
  );
}
bootstrap();
