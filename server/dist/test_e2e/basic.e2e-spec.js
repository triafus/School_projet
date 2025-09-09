"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const globals_1 = require("@jest/globals");
const app_module_1 = require("../src/app.module");
(0, globals_1.describe)("Basic checks (e2e)", () => {
    let app;
    (0, globals_1.beforeAll)(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api");
        await app.init();
    });
    (0, globals_1.afterAll)(async () => {
        await app.close();
    });
    (0, globals_1.it)("✔️ /health (GET) → retourne 200", () => {
        return request(app.getHttpServer()).get("/api/health").expect(200);
    });
    (0, globals_1.it)("✔️ /auth/login (POST) mauvais identifiants → retourne 401", () => {
        return request(app.getHttpServer())
            .post("/api/auth/login")
            .send({ email: "fake@example.com", password: "wrongpass" })
            .expect(401);
    });
    (0, globals_1.it)("✔️ /images (POST) sans token → retourne 401", () => {
        return request(app.getHttpServer())
            .post("/api/images")
            .field("title", "Test Image")
            .expect(401);
    });
});
//# sourceMappingURL=basic.e2e-spec.js.map