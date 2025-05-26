import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseCleanupService } from '../common/services/database-cleanup.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private databaseCleanupService: DatabaseCleanupService
  ) {}
  // Get all users
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        phoneNumber: true,
        employeeNumber: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }
  // Get user by ID
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        phoneNumber: true,
        employeeNumber: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  // Update user
  async updateUser(id: string, dto: Partial<RegisterDto>) {
    const data: any = { ...dto };
    
    // Hash password if provided
    if (dto.password) {
      data.password = await this.hashPassword(dto.password);
    }
    
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,      select: {
        id: true,
        fullName: true,
        username: true,
        phoneNumber: true,
        employeeNumber: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return user;
  }  // Update user status
  async updateUserStatus(id: string, status: string) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        phoneNumber: true,
        employeeNumber: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return user;
  }

  // Delete user
  async deleteUser(id: string) {
    // Use database cleanup service to safely remove related logs and data
    await this.databaseCleanupService.cleanupUser(id);
    
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    
    return { message: 'Usuario eliminado exitosamente' };
  }

  // Helper methods
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}