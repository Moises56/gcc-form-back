import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('ADMIN')
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Roles('ADMIN', 'MODERADOR')
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<RegisterDto>,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Roles('ADMIN')
  @Put(':id/status')
  updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(id, dto.status);
  }

  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}