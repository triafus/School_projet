import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRole } from "./user-role.enum";
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    create(createUserDto: CreateUserDto): Promise<User>;
    updateRole(id: number, role: UserRole): Promise<User>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(id: number, currentUserId?: number): Promise<void>;
    findByEmail(email: string, includePassword?: boolean): Promise<User | null>;
    findById(id: number): Promise<User>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
    changePassword(id: number, currentPassword: string, newPassword: string): Promise<void>;
}
