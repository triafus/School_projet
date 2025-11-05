"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
describe("Basic checks (e2e)", () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api");
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it("✔️ /health (GET) → retourne 200", () => {
        return request(app.getHttpServer()).get("/api/health").expect(200);
    });
    it("✔️ /auth/login (POST) mauvais identifiants → retourne 401", () => {
        return request(app.getHttpServer())
            .post("/api/auth/login")
            .send({ email: "fake@example.com", password: "wrongpass" })
            .expect(401);
    });
    it("✔️ /images (POST) sans token → retourne 401", () => {
        return request(app.getHttpServer())
            .post("/api/images")
            .field("title", "Test Image")
            .expect(401);
    });
});
//# sourceMappingURL=basic.e2e-spec.js.map