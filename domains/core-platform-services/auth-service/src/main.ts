import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { winstonConfig } from './winston.config';

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
    },
    logger: winstonConfig,
  });
  
  await app.listen();
  console.log('Auth microservice running on TCP port 3001');
}

bootstrap();

