import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { username: dto.username },
          ...(dto.employeeNumber ? [{ employeeNumber: dto.employeeNumber }] : []),
        ],
      },
    });

    if (userExists) {
      throw new ForbiddenException('Credenciales ya están en uso');
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

  async login(dto: LoginDto, res: Response) {
    // Find user by username or email
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
}