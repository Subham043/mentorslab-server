import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UserDto): Promise<User> {
    return await this.prisma.user.create({
      data: { ...dto },
    });
  }

  async update(id: number, dto: UserDto): Promise<User> {
    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { ...dto },
    });
    return await this.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
