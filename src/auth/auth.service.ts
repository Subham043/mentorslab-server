import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private usersService: UserService,
  ) {}

  // async validateUser(dto: AuthDto): Promise<User | null> {
  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       email: dto.email,
  //       otp: Number(dto.otp),
  //     },
  //   });
  //   if (user) {
  //     return user;
  //   }
  //   return null;
  // }

  async validateUser(dto: AuthDto): Promise<any> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, otp: user.otp };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
