"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const globals_1 = require("@jest/globals");
const typeorm_test_config_1 = require("./typeorm-test.config");
(0, globals_1.beforeAll)(async () => {
    const module = await testing_1.Test.createTestingModule({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(typeorm_test_config_1.testDatabaseConfig),
        ],
    }).compile();
    global.testApp = module.createNestApplication();
    await global.testApp.init();
}, 30000);
(0, globals_1.afterAll)(async () => {
    if (global.testApp) {
        await global.testApp.close();
    }
});
//# sourceMappingURL=setup.js.map