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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const dotenv = __importStar(require("dotenv"));
const config_1 = require("@nestjs/config");
const auth_1 = require("./auth");
const common_1 = require("@nestjs/common");
const rpc_exception_filter_1 = require("./common/filters/rpc-exception.filter");
dotenv.config();
const winston_config_1 = require("./winston.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_config_1.winstonConfig,
    });
    const configService = app.get(config_1.ConfigService);
    const PORT = parseInt(process.env.PORT) || 3005;
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: PORT,
        },
    });
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    if (process.env.RABBITMQ_ENABLED !== 'false') {
        try {
            app.connectMicroservice({
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [rabbitmqUrl],
                    queue: 'academy_user_events',
                    exchange: 'user_events',
                    exchangeType: 'fanout',
                    queueOptions: {
                        durable: false
                    },
                },
            });
            console.log(`Academy: RabbitMQ transport configured for ${rabbitmqUrl}`);
        }
        catch (e) {
            console.warn(`Academy: RabbitMQ transport not available: ${e.message}`);
        }
    }
    else {
        console.log('Academy: RabbitMQ disabled via RABBITMQ_ENABLED=false');
    }
    app.useGlobalFilters(new rpc_exception_filter_1.RpcExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalGuards(app.get(auth_1.AcademyProfileGuard));
    await app.startAllMicroservices();
    console.log(`Academy microservice listening on TCP port ${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map