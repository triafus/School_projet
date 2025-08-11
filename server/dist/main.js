"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log("App démarrée");
    app.enableCors({
        origin: process.env.VITE_FRONT_URL || "http://localhost:3000",
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.setGlobalPrefix("api");
    await app.listen(process.env.PORT || 3001, "0.0.0.0");
}
bootstrap();
//# sourceMappingURL=main.js.map