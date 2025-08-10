import { UsersService } from "./users.service";
import { UserRole } from "./user-role.enum";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    getProfile(req: any): Promise<import("./user.entity").User>;
    getAdminOnlyData(req: any): Promise<{
        message: string;
    }>;
    updateUserRole(id: number, role: UserRole): Promise<{
        message: string;
        user: import("./user.entity").User;
    }>;
    deleteUser(id: number, req: any): Promise<{
        message: string;
    }>;
    findOne(id: number): Promise<import("./user.entity").User>;
}
