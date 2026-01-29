"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./winston.config");
const common_1 = require("@nestjs/common");
const rpc_exception_filter_1 = require("./common/filters/rpc-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
        },
        logger: winston_config_1.winstonConfig,
    });
    app.useGlobalFilters(new rpc_exception_filter_1.RpcExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen();
    console.log('Auth microservice running on TCP port 3001');
}
bootstrap();
//# sourceMappingURL=main.js.map