"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./users/user.entity");
const image_entity_1 = require("./images/image.entity");
const images_module_1 = require("./images/images.module");
const health_controller_1 = require("./health/health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot(process.env.NODE_ENV === "test" && process.env.USE_SQLITE !== "false"
                ? {
                    type: "sqlite",
                    database: ":memory:",
                    entities: [user_entity_1.User, image_entity_1.Image],
                    synchronize: true,
                    logging: false,
                }
                : {
                    type: "postgres",
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE || process.env.DB_NAME,
                    ssl: process.env.DB_SSL === "true"
                        ? { rejectUnauthorized: false }
                        : false,
                    entities: [user_entity_1.User, image_entity_1.Image],
                    synchronize: true,
                    logging: process.env.NODE_ENV !== "test",
                    logger: "advanced-console",
                }),
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ||
                    "SSILXFBvfr26VgVNcNOpYyyoKWtOACp9sAPG3k3xEBB+Pvn9qyO3GBdHXRUZNah+WjMeepI7B1DX8lKUU7AqvA==",
                signOptions: { expiresIn: "24h" },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            images_module_1.ImagesModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map