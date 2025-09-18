import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationDto } from "../dto/pagination.dto";
import { UserRole } from "./user-role.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ["images"],
      select: ["id", "email", "firstName", "lastName", "role", "createdAt"],
      order: { createdAt: "DESC" },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log("DTO reçu :", createUserDto);

    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    console.log("existingUser :", existingUser);

    if (existingUser) {
      throw new ConflictException("Un utilisateur avec cet email existe déjà");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log("Password hashé :", hashedPassword);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    console.log("Entité construite :", user);

    const savedUser = await this.usersRepository.save(user);
    console.log("User sauvegardé :", savedUser);

    return savedUser;
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const { firstName, lastName, email } = updateUserDto;

    if (email && email !== user.email) {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException(
          "Un utilisateur avec cet email existe déjà"
        );
      }
      user.email = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    return this.usersRepository.save(user);
  }

  async deleteUser(id: number, currentUserId?: number): Promise<void> {
    if (id === currentUserId) {
      throw new ForbiddenException(
        "Vous ne pouvez pas supprimer votre propre compte"
      );
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
  }

  async findByEmail(
    email: string,
    includePassword = false
  ): Promise<User | null> {
    const select: (keyof User)[] = [
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

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["images"],
      select: ["id", "email", "firstName", "lastName", "role", "createdAt"],
    });

    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
    return user;
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ["id", "password"],
    });

    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    const isValid = await this.validatePassword(currentPassword, user.password);
    if (!isValid) {
      throw new ForbiddenException("Mot de passe actuel incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);
  }
}
