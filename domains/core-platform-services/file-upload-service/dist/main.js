"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./winston.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_config_1.winstonConfig,
    });
    app.enableCors();
    const port = process.env.PORT || 3009;
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: 3019,
        },
    });
    await app.startAllMicroservices();
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map