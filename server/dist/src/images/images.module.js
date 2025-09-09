"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const image_entity_1 = require("./image.entity");
const users_module_1 = require("../users/users.module");
const images_controller_1 = require("./images.controller");
const images_service_1 = require("./images.service");
const supabase_service_1 = require("../supabase/supabase.service");
const upload_limite_middleware_1 = require("./middleware/upload-limite.middleware");
let ImagesModule = class ImagesModule {
    configure(consumer) {
        consumer
            .apply(upload_limite_middleware_1.UploadLimitMiddleware)
            .forRoutes({ path: "api/images", method: common_1.RequestMethod.POST });
    }
};
exports.ImagesModule = ImagesModule;
exports.ImagesModule = ImagesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([image_entity_1.Image]), users_module_1.UsersModule],
        controllers: [images_controller_1.ImagesController],
        providers: [images_service_1.ImagesService, supabase_service_1.SupabaseService],
        exports: [images_service_1.ImagesService],
    })
], ImagesModule);
//# sourceMappingURL=images.module.js.map