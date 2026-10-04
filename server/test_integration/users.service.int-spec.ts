import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/user.entity';
import { Image } from '../src/images/image.entity';
import { Collection } from '../src/collections/collection.entity';
import { ConfigModule } from '@nestjs/config';

describe('UsersService (Integration)', () => {
  let service: UsersService;
  let moduleRef: TestingModule;

  const testEmail = 'int_test_cleanup@example.com';
  const testEmail2 = 'int_test_findAll@example.com';

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true,
          ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
        }),
        TypeOrmModule.forFeature([User, Image, Collection]),
      ],
      providers: [UsersService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    // Cleanup any lingering users from tests
    const users = await service.findAll();
    for (const u of users) {
      if (u.email.startsWith('int_test_')) {
        try { await service.deleteUser(u.id); } catch (e) {}
      }
    }
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  describe('UsersService integration', () => {
    it('should create a new user', async () => {
      const user = await service.create({
        email: testEmail,
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.firstName).toBe('John');
    });

    it('should find user by email', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user?.email).toBe(testEmail);
    });

    it('should throw when creating duplicate email', async () => {
      await expect(
        service.create({
          email: testEmail,
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow();
    });

    it('should update user role', async () => {
      const user = await service.findByEmail(testEmail);
      if (user) {
        const updatedUser = await service.updateRole(user.id, 'admin' as any);
        expect(updatedUser.role).toBe('admin');
      }
    });

    it('should findAll users including newly created', async () => {
      await service.create({
        email: testEmail2,
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
      });
      const users = await service.findAll();
      expect(users.length).toBeGreaterThanOrEqual(2);
      const found = users.find((u) => u.email === testEmail2);
      expect(found).toBeDefined();
    });

    it('should delete users', async () => {
      const u1 = await service.findByEmail(testEmail);
      if (u1) await service.deleteUser(u1.id);
      
      const u2 = await service.findByEmail(testEmail2);
      if (u2) await service.deleteUser(u2.id);

      const deleted1 = await service.findByEmail(testEmail);
      expect(deleted1).toBeNull();
    });
  });
});
