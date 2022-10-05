import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import {
  UserCreateDto,
  UserGetDto,
  UserPaginateDto,
  UserUpdateDto,
} from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async createUser(dto: UserCreateDto): Promise<UserGetDto | undefined> {
    try {
      const { password } = dto;
      const hash = await bcrypt.hash(
        password,
        Number(process.env.saltOrRounds),
      );
      dto.password = hash;
      const user = await this.create({
        ...dto,
        otp: Math.floor(1111 + Math.random() * 9999),
        verified: true,
      });
      if (!user) return undefined;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      return undefined;
    }
  }

  async create(values: any): Promise<any | undefined> {
    const user = await this.prisma.user.create({
      data: {
        ...values,
      },
    });
    return user;
  }

  async updateUser(
    id: number,
    dto: UserUpdateDto,
  ): Promise<UserGetDto | undefined> {
    const checkUser = await this.findOne(id);
    if (dto.email) {
      const validateEmail = await this.validateUniqueEmail(dto.email);
      if (validateEmail.status && validateEmail.email !== checkUser.email)
        throw new HttpException(
          'Email is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (dto.phone) {
      const validatePhone = await this.validateUniquePhone(dto.phone);
      if (validatePhone.status && validatePhone.phone !== checkUser.phone)
        throw new HttpException(
          'Phone is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }
    const { password } = dto;
    if (password) {
      const hash = await bcrypt.hash(
        password,
        Number(process.env.saltOrRounds),
      );
      dto.password = hash;
    }
    const user = await this.update({ id }, { ...dto });
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async update(whereData: {}, value: {}): Promise<any | undefined> {
    const user = await this.prisma.user.update({
      where: { ...whereData },
      data: { ...value },
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

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<UserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.user.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
        blocked: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const count = await this.prisma.user.count({
      where: {
        role: 'USER',
      },
    });
    return {
      data,
      count,
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<any | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...value,
      },
    });
    return user;
  }

  async findOne(id: number): Promise<UserGetDto | undefined> {
    const user = await this.find({ id });
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: user.verified,
      blocked: user.blocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<UserGetDto | undefined> {
    const user = await this.find({ email });
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByPhone(phone: string): Promise<UserGetDto | undefined> {
    const user = await this.find({ phone });
    if (!user) return undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
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
