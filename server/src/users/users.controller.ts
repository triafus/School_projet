import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { PaginationDto } from '../dto/pagination.dto';
import { UserRole } from './user-role.enum';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get('admin-only')
  @Roles('admin')
  async getAdminOnlyData(@Request() req) {
    return {
      message: `Hello ${req.user.firstName}, tu es un admin 🎉`,
    };
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateUserRole(@Param('id') id: number, @Body('role') role: UserRole) {
    const user = await this.usersService.updateRole(+id, role);
    return {
      message: `Rôle mis à jour : ${user.email} → ${user.role}`,
      user,
    };
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: number, @Request() req) {
    if (req.user.id === +id) {
      throw new ForbiddenException(
        'Vous ne pouvez pas supprimer votre propre compte',
      );
    }

    await this.usersService.deleteUser(+id);
    return {
      message: 'Utilisateur supprimé avec succès',
    };
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: number) {
    return this.usersService.findById(+id);
  }
}
