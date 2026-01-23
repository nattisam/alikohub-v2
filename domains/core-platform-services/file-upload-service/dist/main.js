"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./winston.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_config_1.winstonConfig,
    });
    app.enableCors();
    const port = process.env.PORT || 3009;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map