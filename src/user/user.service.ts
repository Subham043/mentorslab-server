import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserCreateDto, UserGetDto, UserUpdateDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async create(dto: UserCreateDto): Promise<UserGetDto | undefined> {
    const { password } = dto;
    const hash = await bcrypt.hash(password, Number(process.env.saltOrRounds));
    dto.password = hash;
    const user = await this.prisma.user.create({
      data: { ...dto },
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
    return user;
  }

  async update(
    id: number,
    dto: UserUpdateDto,
  ): Promise<UserGetDto | undefined> {
    const { password } = dto;
    if (password) {
      const hash = await bcrypt.hash(password, process.env.saltOrRounds);
      dto.password = hash;
    }
    const user = await this.prisma.user.update({
      where: { id: Number(id) },
      data: { ...dto },
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
    return user;
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<UserGetDto | undefined> {
    const user = await this.prisma.user.findFirst({
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
    return user;
  }

  async findOne(id: number): Promise<UserGetDto | undefined> {
    return await this.find({ id });
  }

  async findByEmail(email: string): Promise<UserGetDto | undefined> {
    return await this.find({ email });
  }

  async findByPhone(phone: string): Promise<UserGetDto | undefined> {
    return await this.find({ phone });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }

  async validateUniqueEmail(
    email: string,
  ): Promise<{ status: boolean; email: string | null }> {
    const checkUserByEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });
    if (checkUserByEmail)
      return { status: true, email: checkUserByEmail.email };
    return { status: false, email: null };
  }

  async validateUniquePhone(
    phone: string,
  ): Promise<{ status: boolean; phone: string | null }> {
    const checkUserByPhone = await this.prisma.user.findFirst({
      where: {
        phone,
      },
      select: {
        phone: true,
      },
    });
    if (checkUserByPhone)
      return { status: true, phone: checkUserByPhone.phone };
    return { status: false, phone: null };
  }
}
