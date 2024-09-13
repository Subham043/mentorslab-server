import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import {
  UserProfileAdminCreateDto,
  UserProfileAdminGetDto,
  UserProfileAdminPaginateDto,
  UserProfileAdminUpdateDto,
} from '../dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserProfileAdminService {
  private readonly UserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    blocked: true,
    verified: true,
    createdAt: true,
    updatedAt: true,
  };
  constructor(private prisma: PrismaService) {}

  async createUser(
    dto: UserProfileAdminCreateDto,
  ): Promise<UserProfileAdminGetDto | undefined> {
    try {
      const { password } = dto;
      const hashed = await bcrypt.hash(
        password,
        Number(process.env.saltOrRounds),
      );
      console.log(hashed);
      dto.password = hashed;

      const user = await this.prisma.user.create({
        data: {
          ...dto,
          otp: Math.floor(1000 + Math.random() * 9000),
        },
      });
      if (!user) return undefined;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        blocked: user.blocked,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.log(error);
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
    dto: UserProfileAdminUpdateDto,
  ): Promise<UserProfileAdminGetDto | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (dto.email && dto.email !== user.email) {
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
      id: userUpdate.id,
      name: userUpdate.name,
      email: userUpdate.email,
      phone: userUpdate.phone,
      role: userUpdate.role,
      blocked: userUpdate.blocked,
      verified: userUpdate.verified,
      createdAt: userUpdate.createdAt,
      updatedAt: userUpdate.updatedAt,
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

  async findAll(): Promise<UserProfileAdminGetDto[]> {
    return await this.prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        role: 'USER',
      },
      select: this.UserSelect,
    });
  }

  async getAllUserWithoutContentAssigned(
    id: number,
  ): Promise<UserProfileAdminGetDto[]> {
    return await this.prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        role: 'USER',
      },
      select: {
        ...this.UserSelect,
        ContentAssignedTo: {
          where: {
            assignedContentId: id,
            NOT: [
              {
                assignedRole: 'PURCHASED',
              },
            ],
          },
        },
      },
    });
  }

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<UserProfileAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: {
        role: 'USER',
      },
      select: this.UserSelect,
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

  async findOne(id: number): Promise<UserProfileAdminGetDto | undefined> {
    const user = await this.find({ id });
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      blocked: user.blocked,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(
    email: string,
  ): Promise<UserProfileAdminGetDto | undefined> {
    const user = await this.find({ email });
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      blocked: user.blocked,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByPhone(
    phone: string,
  ): Promise<UserProfileAdminGetDto | undefined> {
    const user = await this.find({ phone });
    if (!user) return undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      blocked: user.blocked,
      verified: user.verified,
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
