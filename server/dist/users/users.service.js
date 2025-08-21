"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        return this.usersRepository.find({
            relations: ["images"],
            select: ["id", "email", "firstName", "lastName", "role", "createdAt"],
            order: { createdAt: "DESC" },
        });
    }
    async create(createUserDto) {
        console.log("DTO reçu :", createUserDto);
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        console.log("existingUser :", existingUser);
        if (existingUser) {
            throw new common_1.ConflictException("Un utilisateur avec cet email existe déjà");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        console.log("Password hashé :", hashedPassword);
        const user = this.usersRepository.create(Object.assign(Object.assign({}, createUserDto), { password: hashedPassword }));
        console.log("Entité construite :", user);
        const savedUser = await this.usersRepository.save(user);
        console.log("User sauvegardé :", savedUser);
        return savedUser;
    }
    async updateRole(id, role) {
        const user = await this.findById(id);
        user.role = role;
        return this.usersRepository.save(user);
    }
    async updateUser(id, updateUserDto) {
        const user = await this.findById(id);
        const { firstName, lastName, email } = updateUserDto;
        if (email && email !== user.email) {
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new common_1.ConflictException("Un utilisateur avec cet email existe déjà");
            }
            user.email = email;
        }
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        return this.usersRepository.save(user);
    }
    async deleteUser(id, currentUserId) {
        if (id === currentUserId) {
            throw new common_1.ForbiddenException("Vous ne pouvez pas supprimer votre propre compte");
        }
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
        }
    }
    async findByEmail(email, includePassword = false) {
        const select = [
            "id",
            "email",
            "firstName",
            "lastName",
            "role",
            "createdAt",
        ];
        if (includePassword) {
            select.push("password");
        }
        return this.usersRepository.findOne({
            where: { email },
            relations: ["images"],
            select,
        });
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ["images"],
            select: ["id", "email", "firstName", "lastName", "role", "createdAt"],
        });
        if (!user) {
            throw new common_1.NotFoundException("Utilisateur non trouvé");
        }
        return user;
    }
    async validatePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ["id", "password"],
        });
        if (!user) {
            throw new common_1.NotFoundException("Utilisateur non trouvé");
        }
        const isValid = await this.validatePassword(currentPassword, user.password);
        if (!isValid) {
            throw new common_1.ForbiddenException("Mot de passe actuel incorrect");
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map