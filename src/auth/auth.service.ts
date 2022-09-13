import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(dto: AuthDto): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        otp: Number(dto.otp)
      },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, otp: user.otp };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
