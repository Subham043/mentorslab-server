import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthDto, JwtPayload, OtpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Token } from './dto/token.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private usersService: UserService,
  ) {}

  async generateTokens(user: any): Promise<Token> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_KEY || 'secretKey',
        expiresIn: process.env.JWT_EXPIRY_TIME || '60s',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_REFRESH_SECRET_KEY || 'secretKey',
        expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME || '1d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async validateUserLogin(dto: AuthDto): Promise<Token> {
    const validateEmail = await this.usersService.validateUniqueEmail(
      dto.email,
    );
    if (!validateEmail.status)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const token = await this.generateTokens(user);
    return token;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Token> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    // const refreshTokenMatches = await argon2.verify(
    //   user.refreshToken,
    //   refreshToken,
    // );
    // if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const token = await this.generateTokens(user);
    return token;
  }

  async generateAndSendOtp(otpDto: OtpDto): Promise<{ message: string }> {
    const validateEmail = await this.usersService.validateUniqueEmail(
      otpDto.email,
    );
    if (!validateEmail.status)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    await this.prisma.user.update({
      where: { ...otpDto },
      data: { otp: Math.floor(1111 + Math.random() * 9999) },
    });
    return { message: 'Otp sent successfully' };
  }
}
