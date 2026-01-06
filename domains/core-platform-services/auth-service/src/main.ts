import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppLogger } from './logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
    },
    logger: new AppLogger(),
  });
  
  await app.listen();
  console.log('Auth microservice running on TCP port 3001');
}

bootstrap();

