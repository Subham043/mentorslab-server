import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserCreateDto, UserGetDto, UserUpdateDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UserCreateDto): Promise<UserGetDto> {
    const user = await this.prisma.user.create({
      data: { ...dto },
    });
    return await this.find({id:user.id});
  }

  async update(id: number, dto: UserUpdateDto): Promise<UserGetDto> {
    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { ...dto },
    });
    return await this.find({id});
  }

  async findAll(): Promise<UserGetDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async find(value:{}): Promise<UserGetDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        ...value,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if(!user) throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    return user;
  }

  async findOne(id: number): Promise<UserGetDto> {
    return await this.find({id});
  }
  
  async findByEmail(email: string): Promise<UserGetDto> {
    return await this.find({email});
  }
  
  async findByPhone(phone: string): Promise<UserGetDto> {
    return await this.find({phone});
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
