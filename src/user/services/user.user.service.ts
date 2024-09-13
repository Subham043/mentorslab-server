import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UserProfileGetDto,
  UserProfileUpdateDto,
  UserPasswordUpdateDto,
} from '../dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async updateUserProfile(
    id: number,
    dto: UserProfileUpdateDto,
  ): Promise<UserProfileGetDto | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (dto.email !== user.email) {
      const validateEmail = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (validateEmail)
        throw new HttpException(
          'Email is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (dto.phone && dto.phone !== user.phone) {
      const validatePhone = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
        },
      });
      if (validatePhone)
        throw new HttpException(
          'Phone is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: { ...dto },
    });
    if (!userUpdate) return undefined;
    return {
      name: userUpdate.name,
      email: userUpdate.email,
      phone: userUpdate.phone,
    };
  }

  async updateUserPassword(
    id: number,
    dto: UserPasswordUpdateDto,
  ): Promise<string | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    const isMatch = await bcrypt.compare(dto.old_password, user.password);

    if (!isMatch)
      throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(
      dto.password,
      Number(process.env.saltOrRounds),
    );
    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    if (!user) return undefined;
    return 'Password updated successfully';
  }
}
