import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { winstonConfig } from './winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
  
  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3009; // Default to 3009 for File Service
  // Connect TCP microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3019,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
