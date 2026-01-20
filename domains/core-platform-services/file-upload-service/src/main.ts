import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonConfig } from './winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
  
  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3009; // Default to 3009 for File Service
  await app.listen(port);
  // No need for explicit logger.log here as Nest will log startup with Winston
}
bootstrap();
