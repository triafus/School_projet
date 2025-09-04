import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";
import { LoginDto } from "./dto/login.dto";

describe("AuthService", () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    password: "hashedPassword123",
    role: "user",
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockUsersService = {
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should return user when credentials are valid", async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);

      // Act
      const result = await service.validateUser(
        "test@example.com",
        "password123"
      );

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        "test@example.com",
        true
      );
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        "password123",
        "hashedPassword123"
      );
    });

    it("should return null when user is not found", async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser(
        "nonexistent@example.com",
        "password123"
      );

      // Assert
      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com",
        true
      );
      expect(mockUsersService.validatePassword).not.toHaveBeenCalled();
    });

    it("should return null when password is invalid", async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      // Act
      const result = await service.validateUser(
        "test@example.com",
        "wrongpassword"
      );

      // Assert
      expect(result).toBeNull();
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedPassword123"
      );
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    it("✔️ should return access token and user info when credentials are valid", async () => {
      // Arrange
      const mockToken = "mock.jwt.token";
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { email: mockUser.email, sub: mockUser.id, role: mockUser.role },
        { expiresIn: "1h" }
      );
    });

    it("✔️ should throw UnauthorizedException when credentials are invalid", async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        "Identifiants invalides"
      );
    });

    it("✔️ should throw UnauthorizedException when password is wrong", async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        "Identifiants invalides"
      );
    });
  });

  describe("register", () => {
    const createUserDto = {
      email: "newuser@example.com",
      password: "password123",
      firstName: "New",
      lastName: "User",
    };

    it("should register new user and return access token", async () => {
      // Arrange
      const newUser = { ...mockUser, ...createUserDto, id: 2 };
      const mockToken = "mock.jwt.token";
      mockUsersService.create.mockResolvedValue(newUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.register(createUserDto);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { email: newUser.email, sub: newUser.id, role: newUser.role },
        { expiresIn: "1h" }
      );
    });
  });
});


