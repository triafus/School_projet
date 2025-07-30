import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UsersService } from "./users.service";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles("admin")
  async findAll() {
    return this.usersService.findAll();
  }

  @Get("profile")
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get("admin-only")
  @Roles("admin")
  async getAdminOnlyData(@Request() req) {
    return {
      message: `Hello ${req.user.firstName}, tu es un admin 🎉`,
    };
  }

  @Patch(":id/role")
  @Roles("admin")
  async updateUserRole(@Param("id") id: number, @Body("role") role: string) {
    const user = await this.usersService.updateRole(+id, role);
    return {
      message: `Rôle mis à jour : ${user.email} → ${user.role}`,
    };
  }
}
