import { otelSDK } from './common/tracing/tracing';
import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

// Start OpenTelemetry SDK
otelSDK.start();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './auth-service/user/user.module';
import { ConTechServiceModule } from './contech-service/contech-service.module';
import { EventsServiceModule } from './events-service/events-service.module';
import { AcademyServiceModule } from './academy-service';
import { winstonConfig } from './winston.config';
import { RpcExceptionFilter } from './common/filters';

// Bootstrap the application
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  const logger = new Logger('Bootstrap');

  // Enable CORS
  // Enable CORS
  // Enable CORS with explicit origins for production
  const allowedOrigins = [
    'https://www.academy.alikohub.com',
    'https://academy.alikohub.com',
    'http://www.academy.alikohub.com',
    'http://academy.alikohub.com',
    'https://www.alikohub.com',
    'https://alikohub.com',
    'http://www.alikohub.com',
    'http://alikohub.com',
    'https://career.alikohub.com',
    'https://www.career.alikohub.com',
    'http://career.alikohub.com',
    'http://www.career.alikohub.com',
    'https://event.alikohub.com',
    'https://www.event.alikohub.com',
    'http://event.alikohub.com',
    'http://www.event.alikohub.com',
    'https://con-tech.alikohub.com',
    'https://www.con-tech.alikohub.com',
    'http://con-tech.alikohub.com',
    'http://www.con-tech.alikohub.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3006',
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Cookie', 
      'X-Requested-With', 
      'Accept', 
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'x-apollo-operation-name',
      'apollo-require-preflight'
    ],
    exposedHeaders: ['Set-Cookie', 'Authorization'],
    maxAge: 3600, // 1 hour cache for preflight
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
 
