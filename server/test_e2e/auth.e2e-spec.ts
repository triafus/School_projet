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
  const adminEmail = `e2e_admin_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let jwtToken = '';
  let adminJwtToken = '';

  const cleanupUsers = async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource
        .getRepository(User)
        .createQueryBuilder()
        .delete()
        .where('email LIKE :pattern', { pattern: 'e2e_%' })
        .execute();
    }
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api');
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await cleanupUsers();
  });

  afterAll(async () => {
    await cleanupUsers();
    await app.close();
  });

  it('/api/auth/register (POST) - should register a new user successfully and not expose password', async () => {
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
    expect(response.body.user.lastName).toBe('Tester');
    expect(response.body.user.role).toBe('user');
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('password');
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

  it('/api/auth/register (POST) - should reject invalid email format', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'invalid-email-format',
        password: testPassword,
        firstName: 'Bad',
        lastName: 'Email',
      })
      .expect(400);
  });

  it('/api/auth/login (POST) - should login and return JWT token without password leakage', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('password');
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
    await request(app.getHttpServer()).get('/api/users/profile').expect(401);
  });

  it('/api/users/profile (GET) - should return user profile with valid JWT token without exposing password', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.email).toBe(testEmail);
    expect(response.body.firstName).toBe('E2E');
    expect(response.body.lastName).toBe('Tester');
    expect(response.body).not.toHaveProperty('password');
  });

  describe('RBAC - Role-Based Access Control', () => {
    it('/api/users (GET) - should deny access (403) to standard user', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(403);
    });

    it('/api/auth/register (POST) - should register an admin user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: adminEmail,
          password: testPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user).not.toHaveProperty('password');
      adminJwtToken = response.body.access_token;
    });

    it('/api/users (GET) - should allow access (200) to admin user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      response.body.forEach((u: any) => {
        expect(u).not.toHaveProperty('password');
      });
    });
  });
});
