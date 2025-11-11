import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Basic checks (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.setGlobalPrefix("api");
      await app.init();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'application:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it("✔️ /health (GET) → retourne 200", () => {
    if (!app) {
      throw new Error("L'application n'est pas initialisée");
    }
    return request(app.getHttpServer()).get("/api/health").expect(200);
  });

  it("✔️ /auth/login (POST) mauvais identifiants → retourne 401", () => {
    if (!app) {
      throw new Error("L'application n'est pas initialisée");
    }
    return request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: "fake@example.com", password: "wrongpass" })
      .expect(401);
  });

  it("✔️ /images (POST) sans token → retourne 401", () => {
    if (!app) {
      throw new Error("L'application n'est pas initialisée");
    }
    return request(app.getHttpServer())
      .post("/api/images")
      .field("title", "Test Image")
      .expect(401);
  });
});
