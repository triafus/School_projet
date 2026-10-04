import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const testEmail = `e2e_user_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let jwtToken = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    // Nettoyage de l'utilisateur créé pour le test dans Postgres
    if (dataSource && dataSource.isInitialized) {
      await dataSource.getRepository(User).delete({ email: testEmail });
    }
    await app.close();
  });

  it('/api/auth/register (POST) - should register a new user successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        firstName: 'E2E',
        lastName: 'Tester',
        role: 'user',
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user.firstName).toBe('E2E');
  });

  it('/api/auth/register (POST) - should reject duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        firstName: 'E2E',
        lastName: 'Tester',
      })
      .expect(409);
  });

  it('/api/auth/register (POST) - should reject invalid data (short password)', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'invalid@example.com',
        password: '123',
        firstName: 'Bad',
        lastName: 'Password',
      })
      .expect(400);
  });

  it('/api/auth/login (POST) - should login and return JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
    jwtToken = response.body.access_token;
  });

  it('/api/auth/login (POST) - should fail with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword!',
      })
      .expect(401);
  });

  it('/api/users/profile (GET) - should reject request without JWT token', async () => {
    await request(app.getHttpServer())
      .get('/api/users/profile')
      .expect(401);
  });

  it('/api/users/profile (GET) - should return user profile with valid JWT token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.email).toBe(testEmail);
    expect(response.body.firstName).toBe('E2E');
    expect(response.body.lastName).toBe('Tester');
  });
});
