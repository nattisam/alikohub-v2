import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { ConTechProfileGuard } from './auth';
import { AppLogger } from './logger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });
  const PORT = process.env.PORT || 3002;
  const configService = app.get(ConfigService);

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORT,
    },
  });

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [configService.get<string>("RABBITMQ_URL")],
  //     queue: 'application_queue',
  //     noAck: true,
  //   }
  // });

  app.useGlobalGuards(app.get(ConTechProfileGuard));

  await app.startAllMicroservices();

  console.log(
    `ConTech microservice listening on TCP running on PORT:${PORT} and connected to both TCP and RabbitMQ`,
  );
}
bootstrap();
