"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const logger_1 = require("./logger");
const auth_1 = require("./auth");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: process.env.EVENTS_SERVICE_HOST || '0.0.0.0',
            port: parseInt(process.env.EVENTS_SERVICE_PORT, 10) || 3004,
        },
        logger: new logger_1.AppLogger(),
    });
    app.useGlobalGuards(app.get(auth_1.EventsProfileGuard));
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map