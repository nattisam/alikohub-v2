import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3010; // New port for Home Service

  // Connect TCP microservice
  // Use a default port for microservice different from HTTP port if needed
  // Or just listen on HTTP if it's simpler. 
  // But given other services use microservices:

  const microservicePort = 3020; // Example microservice port

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: microservicePort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Home service is running on port ${port}`);
}
bootstrap();
