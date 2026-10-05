import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/user.entity';
import { Image } from '../src/images/image.entity';
import { Collection } from '../src/collections/collection.entity';
import { ConfigModule } from '@nestjs/config';
import { UserRole } from '../src/users/user-role.enum';

describe('UsersService (Integration)', () => {
  let service: UsersService;
  let moduleRef: TestingModule;

  const testEmail = `int_test_${Date.now()}@example.com`;
  const testEmail2 = `int_test_second_${Date.now()}@example.com`;
  const initialPassword = 'Password123!';
  const updatedPassword = 'NewPassword456!';

  const cleanTestUsers = async () => {
    try {
      const users = await service.findAll();
      for (const u of users) {
        if (u.email.startsWith('int_test_')) {
          try {
            await service.deleteUser(u.id);
          } catch (e) {
            // Ignorer les erreurs si l'utilisateur est déjà supprimé
          }
        }
      }
    } catch (e) {
      // Ignorer si la base n'est pas encore accessible
    }
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true,
          ssl: process.env.DATABASE_URL?.includes('supabase')
            ? { rejectUnauthorized: false }
            : false,
        }),
        TypeOrmModule.forFeature([User, Image, Collection]),
      ],
      providers: [UsersService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);

    await cleanTestUsers();
  });

  afterAll(async () => {
    await cleanTestUsers();
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  describe('UsersService integration', () => {
    it('should create a new user', async () => {
      const user = await service.create({
        email: testEmail,
        password: initialPassword,
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.role).toBe(UserRole.USER);
    });

    it('should find user by email without password by default', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();
      expect(user!.email).toBe(testEmail);
      expect(user!.password).toBeUndefined();
    });

    it('should find user by email with password hash when requested', async () => {
      const user = await service.findByEmail(testEmail, true);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();
      expect(user!.password).toBeDefined();
      expect(user!.password).not.toBe(initialPassword);
    });

    it('should throw ConflictException when creating user with duplicate email', async () => {
      await expect(
        service.create({
          email: testEmail,
          password: initialPassword,
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should update user role without conditional checks', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();

      const updatedUser = await service.updateRole(user!.id, UserRole.ADMIN);
      expect(updatedUser.role).toBe(UserRole.ADMIN);
    });

    it('should update user firstName and lastName', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();

      const updatedUser = await service.updateUser(user!.id, {
        firstName: 'Jane',
        lastName: 'Smith',
      });

      expect(updatedUser.firstName).toBe('Jane');
      expect(updatedUser.lastName).toBe('Smith');
      expect(updatedUser.email).toBe(testEmail);
    });

    it('should throw ConflictException when updating email to an existing email', async () => {
      // Créer un deuxième utilisateur
      const secondUser = await service.create({
        email: testEmail2,
        password: initialPassword,
        firstName: 'Second',
        lastName: 'User',
      });
      expect(secondUser).toBeDefined();

      const firstUser = await service.findByEmail(testEmail);
      expect(firstUser).toBeDefined();
      expect(firstUser).not.toBeNull();

      // Tenter d'attribuer l'email du 2ème au 1er
      await expect(
        service.updateUser(firstUser!.id, {
          email: testEmail2,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should fail to change password with wrong current password', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();

      await expect(
        service.changePassword(
          user!.id,
          'WrongCurrentPassword!',
          updatedPassword,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should change password successfully with correct current password', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();

      await service.changePassword(user!.id, initialPassword, updatedPassword);

      const userWithNewPassword = await service.findByEmail(testEmail, true);
      expect(userWithNewPassword).toBeDefined();
      expect(userWithNewPassword).not.toBeNull();

      const isValid = await service.validatePassword(
        updatedPassword,
        userWithNewPassword!.password,
      );
      expect(isValid).toBe(true);
    });

    it('should prevent user from deleting their own account', async () => {
      const user = await service.findByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();

      await expect(service.deleteUser(user!.id, user!.id)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should findAll users including newly created test users', async () => {
      const users = await service.findAll();
      expect(users.length).toBeGreaterThanOrEqual(2);

      const found1 = users.find((u) => u.email === testEmail);
      const found2 = users.find((u) => u.email === testEmail2);
      expect(found1).toBeDefined();
      expect(found2).toBeDefined();
    });

    it('should delete users successfully', async () => {
      const u1 = await service.findByEmail(testEmail);
      expect(u1).toBeDefined();
      expect(u1).not.toBeNull();
      await service.deleteUser(u1!.id);

      const u2 = await service.findByEmail(testEmail2);
      expect(u2).toBeDefined();
      expect(u2).not.toBeNull();
      await service.deleteUser(u2!.id);

      const deleted1 = await service.findByEmail(testEmail);
      const deleted2 = await service.findByEmail(testEmail2);
      expect(deleted1).toBeNull();
      expect(deleted2).toBeNull();
    });
  });
});
