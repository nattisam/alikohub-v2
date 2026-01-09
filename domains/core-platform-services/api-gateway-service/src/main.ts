import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './auth-service/user/user.module';
import { ConTechServiceModule } from './contech-service/contech-service.module';
import { EventsServiceModule } from './events-service/events-service.module';
import { AcademyServiceModule } from './academy-service';
import { winstonConfig } from './common/logger/winston.config';
import { RpcExceptionFilter } from './common/filters';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3007', 'http://localhost:3003', 'http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe with detailed error messages
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: false,
    validationError: {
      target: false,
      value: false,
    },
  }));

  // Global exception filters
  app.useGlobalFilters(new RpcExceptionFilter());

  app.use(cookieParser());

  // Swagger setup - Main
  const config = new DocumentBuilder()
    .setTitle('Alikohub API Gateway')
    .setDescription('Central API Gateway documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Swagger setup - Auth Service
  const authConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Authentication and User Management endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const authDocument = SwaggerModule.createDocument(app, authConfig, {
    include: [UserModule],
  });
  SwaggerModule.setup('api-docs/auth', app, authDocument);

  // Swagger setup - ConTech Service
  const contechConfig = new DocumentBuilder()
    .setTitle('ConTech Service API')
    .setDescription('Construction Technology endpoints (Projects, Tasks, Contracts, etc.)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const contechDocument = SwaggerModule.createDocument(app, contechConfig, {
    include: [ConTechServiceModule],
  });
  SwaggerModule.setup('api-docs/contech', app, contechDocument);

  // Swagger setup - Events Service
  const eventsConfig = new DocumentBuilder()
    .setTitle('Events Service API')
    .setDescription('Events Management endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const eventsDocument = SwaggerModule.createDocument(app, eventsConfig, {
    include: [EventsServiceModule],
  });
  SwaggerModule.setup('api-docs/events', app, eventsDocument);

  // Swagger setup - Academy Service
  const academyConfig = new DocumentBuilder()
    .setTitle('Academy Service API')
    .setDescription('Academy and LMS endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const academyDocument = SwaggerModule.createDocument(app, academyConfig, {
    include: [AcademyServiceModule],
  });
  SwaggerModule.setup('api-docs/academy', app, academyDocument);

  const port = process.env.PORT ?? 3006;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 API Gateway running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
}
bootstrap();
 
