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
  const PORT = process.env.PORT || 3002;
  const configService = app.get(ConfigService);

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: PORT,
    },
  });

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

  app.useGlobalGuards(app.get(ConTechProfileGuard));

  await app.startAllMicroservices();

  console.log(
    `ConTech microservice listening on TCP running on PORT:${PORT}`,
  );
}
bootstrap();
