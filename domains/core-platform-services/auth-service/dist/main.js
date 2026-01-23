"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./winston.config");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: parseInt(process.env.AUTH_SERVICE_PORT) || 3001,
        },
        logger: winston_config_1.winstonConfig,
    });
    await app.listen();
    console.log('Auth microservice running on TCP port 3001');
}
bootstrap();
//# sourceMappingURL=main.js.map