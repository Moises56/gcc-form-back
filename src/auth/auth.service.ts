import { ForbiddenException, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: RegisterDto) {
    // Check if user exists with more specific error messages
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUserByEmail) {
      throw new ForbiddenException(`El email ${dto.email} ya está en uso`);
    }

    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUserByUsername) {
      throw new ForbiddenException(`El nombre de usuario ${dto.username} ya está en uso`);
    }

    if (dto.employeeNumber) {
      const existingUserByEmployeeNumber = await this.prisma.user.findUnique({
        where: { employeeNumber: dto.employeeNumber },
      });

      if (existingUserByEmployeeNumber) {
        throw new ForbiddenException(`El número de empleado ${dto.employeeNumber} ya está en uso`);
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        username: dto.username,
        phoneNumber: dto.phoneNumber,
        employeeNumber: dto.employeeNumber,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'OPERADOR',
      },
    });

    // Return user without password
    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto, res: Response) {    // Find user by username or email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.usernameOrEmail },
          { username: dto.usernameOrEmail },
        ],
      },
    });

    if (!user) {
      throw new ForbiddenException('Credenciales incorrectas');
    }

    // Check if user is active
    if (user.status !== 'ACTIVO') {
      throw new ForbiddenException('Su cuenta está inactiva. Contacte al administrador.');
    }

    // Compare passwords
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    
    if (!passwordMatches) {
      throw new ForbiddenException('Credenciales incorrectas');
    }

    // Generate tokens and set cookie
    const tokens = await this.getTokens(user.id, user.username);
    
    // Set cookie with the access token
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return user without password and with access token
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: tokens.accessToken,
    };
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    return { message: 'Sesión cerrada exitosamente' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    const { password, ...result } = user;
    return result;
  }

  // Helper functions
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async getTokens(userId: string, username: string): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      username,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    return {
      accessToken,
    };
  }

  // Métodos para autogestión de perfil
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    // Verificar si el email ya está en uso por otro usuario
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new BadRequestException(`El email ${dto.email} ya está en uso por otro usuario`);
      }
    }

    // Actualizar el usuario
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
        ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
        ...(dto.email && { email: dto.email }),
      },
    });

    // Retornar sin la contraseña
    const { password, ...result } = updatedUser;
    return result;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    // Verificar la contraseña actual
    const passwordMatches = await bcrypt.compare(dto.currentPassword, user.password);
    
    if (!passwordMatches) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Verificar que la nueva contraseña sea diferente
    const samePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (samePassword) {
      throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
    }

    // Hash de la nueva contraseña
    const hashedNewPassword = await this.hashPassword(dto.newPassword);

    // Actualizar la contraseña
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}