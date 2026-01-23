"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = __importStar(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_1 = require("@nestjs/swagger");
const user_module_1 = require("./auth-service/user/user.module");
const contech_service_module_1 = require("./contech-service/contech-service.module");
const events_service_module_1 = require("./events-service/events-service.module");
const academy_service_1 = require("./academy-service");
const winston_config_1 = require("./winston.config");
const filters_1 = require("./common/filters");
dotenv.config();
// Bootstrap the application
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_config_1.winstonConfig,
    });
    const logger = new common_1.Logger('Bootstrap');
    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Global validation pipe with detailed error messages
    app.useGlobalPipes(new common_1.ValidationPipe({
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
    app.useGlobalFilters(new filters_1.RpcExceptionFilter());
    app.use((0, cookie_parser_1.default)());
    // Swagger setup - Main
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Alikohub API Gateway')
        .setDescription('Central API Gateway documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    // Swagger setup - Auth Service
    const authConfig = new swagger_1.DocumentBuilder()
        .setTitle('Auth Service API')
        .setDescription('Authentication and User Management endpoints')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const authDocument = swagger_1.SwaggerModule.createDocument(app, authConfig, {
        include: [user_module_1.UserModule],
    });
    swagger_1.SwaggerModule.setup('api-docs/auth', app, authDocument);
    // Swagger setup - ConTech Service
    const contechConfig = new swagger_1.DocumentBuilder()
        .setTitle('ConTech Service API')
        .setDescription('Construction Technology endpoints (Projects, Tasks, Contracts, etc.)')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const contechDocument = swagger_1.SwaggerModule.createDocument(app, contechConfig, {
        include: [contech_service_module_1.ConTechServiceModule],
    });
    swagger_1.SwaggerModule.setup('api-docs/contech', app, contechDocument);
    // Swagger setup - Events Service
    const eventsConfig = new swagger_1.DocumentBuilder()
        .setTitle('Events Service API')
        .setDescription('Events Management endpoints')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const eventsDocument = swagger_1.SwaggerModule.createDocument(app, eventsConfig, {
        include: [events_service_module_1.EventsServiceModule],
    });
    swagger_1.SwaggerModule.setup('api-docs/events', app, eventsDocument);
    // Swagger setup - Academy Service
    const academyConfig = new swagger_1.DocumentBuilder()
        .setTitle('Academy Service API')
        .setDescription('Academy and LMS endpoints')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const academyDocument = swagger_1.SwaggerModule.createDocument(app, academyConfig, {
        include: [academy_service_1.AcademyServiceModule],
    });
    swagger_1.SwaggerModule.setup('api-docs/academy', app, academyDocument);
    const port = process.env.PORT ?? 3006;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 API Gateway running on http://localhost:${port}`);
    logger.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map