"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./winston.config");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const rpc_exception_filter_1 = require("./common/filters/rpc-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_config_1.winstonConfig,
    });
    const port = parseInt(process.env.AUTH_SERVICE_PORT) || 3001;
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter(), new rpc_exception_filter_1.RpcExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: parseInt(process.env.AUTH_TCP_PORT) || 3011,
        },
    });
    await app.startAllMicroservices();
    await app.listen(port, '0.0.0.0');
    logger.log(`Auth service running on HTTP port ${port} and TCP port 3011`);
}
bootstrap();
//# sourceMappingURL=main.js.map