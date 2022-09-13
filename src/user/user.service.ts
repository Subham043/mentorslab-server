import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserCreateDto, UserGetDto, UserUpdateDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthDto } from 'src/auth/dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async create(dto: UserCreateDto): Promise<UserGetDto | undefined> {
    const validateEmail = await this.validateUniqueEmail(dto.email);
    if (validateEmail.status)
      throw new HttpException('Email is already taken', HttpStatus.BAD_REQUEST);

    if (dto.phone) {
      const validatePhone = await this.validateUniquePhone(dto.phone);
      if (validatePhone.status)
        throw new HttpException(
          'Phone is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    const user = await this.prisma.user.create({
      data: { ...dto },
    });
    return await this.findOne(user.id);
  }

  async update(
    id: number,
    dto: UserUpdateDto,
  ): Promise<UserGetDto | undefined> {
    const user = await this.findOne(id);
    if (dto.email) {
      const validateEmail = await this.validateUniqueEmail(dto.email);
      if (validateEmail.status && validateEmail.email !== user.email)
        throw new HttpException(
          'Email is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (dto.phone) {
      const validatePhone = await this.validateUniquePhone(dto.phone);
      if (validatePhone.status && validatePhone.phone !== user.phone)
        throw new HttpException(
          'Phone is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { ...dto },
    });
    return await this.findOne(user.id);
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

  async generateAndSendOtp(email: string): Promise<boolean> {
    const validateEmail = await this.validateUniqueEmail(email);
    if (!validateEmail.status) return false;
    await this.prisma.user.update({
      where: { email },
      data: { otp: Math.floor(1000 + Math.random() * 9000) },
    });
    return true;
  }

  async validateUserLogin(
    dto: AuthDto,
  ): Promise<{ status: boolean; message: string }> {
    const validateEmail = await this.validateUniqueEmail(dto.email);
    if (!validateEmail.status)
      return { status: false, message: 'Invalid credentials' };

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        otp: Number(dto.otp),
      },
      select: {
        email: true,
        otp: true,
      },
    });

    if (!user) return { status: false, message: 'Invalid otp' };
    return { status: true, message: 'Login successful' };
  }
}
