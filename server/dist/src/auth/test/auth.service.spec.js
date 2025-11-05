"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth.service");
const users_service_1 = require("../../users/users.service");
describe("AuthService", () => {
    let service;
    let usersService;
    let jwtService;
    const mockUser = {
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "hashedPassword123",
        role: "user",
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const mockUsersService = {
        findByEmail: jest.fn(),
        validatePassword: jest.fn(),
        create: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("validateUser", () => {
        it("should return user when credentials are valid", async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(true);
            const result = await service.validateUser("test@example.com", "password123");
            expect(result).toEqual(mockUser);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith("test@example.com", true);
            expect(mockUsersService.validatePassword).toHaveBeenCalledWith("password123", "hashedPassword123");
        });
        it("should return null when user is not found", async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            const result = await service.validateUser("nonexistent@example.com", "password123");
            expect(result).toBeNull();
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith("nonexistent@example.com", true);
            expect(mockUsersService.validatePassword).not.toHaveBeenCalled();
        });
        it("should return null when password is invalid", async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(false);
            const result = await service.validateUser("test@example.com", "wrongpassword");
            expect(result).toBeNull();
            expect(mockUsersService.validatePassword).toHaveBeenCalledWith("wrongpassword", "hashedPassword123");
        });
    });
    describe("login", () => {
        const loginDto = {
            email: "test@example.com",
            password: "password123",
        };
        it("✔️ should return access token and user info when credentials are valid", async () => {
            const mockToken = "mock.jwt.token";
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue(mockToken);
            const result = await service.login(loginDto);
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
            expect(mockJwtService.sign).toHaveBeenCalledWith({ email: mockUser.email, sub: mockUser.id, role: mockUser.role }, { expiresIn: "1h" });
        });
        it("✔️ should throw UnauthorizedException when credentials are invalid", async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.login(loginDto)).rejects.toThrow("Identifiants invalides");
        });
        it("✔️ should throw UnauthorizedException when password is wrong", async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(false);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.login(loginDto)).rejects.toThrow("Identifiants invalides");
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
            const newUser = Object.assign(Object.assign(Object.assign({}, mockUser), createUserDto), { id: 2 });
            const mockToken = "mock.jwt.token";
            mockUsersService.create.mockResolvedValue(newUser);
            mockJwtService.sign.mockReturnValue(mockToken);
            const result = await service.register(createUserDto);
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
            expect(mockJwtService.sign).toHaveBeenCalledWith({ email: newUser.email, sub: newUser.id, role: newUser.role }, { expiresIn: "1h" });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map