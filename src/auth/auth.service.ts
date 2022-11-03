import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  AuthDto,
  ForgotPasswordDto,
  JwtPayload,
  OtpDto,
  ResetPasswordDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from './dto/token.dto';
import * as bcrypt from 'bcrypt';
import { decrypt, encrypt } from 'src/common/hooks/encryption.hooks';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
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
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const token = await this.generateTokens(user);
    await this.storeRefreshToken({ email: dto.email }, token.refresh_token);
    return token;
  }

  async signUp(dto: RegisterDto): Promise<any> {
    const { password } = dto;
    const hash = await bcrypt.hash(password, Number(process.env.saltOrRounds));
    dto.password = hash;

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        otp: this.generateOtpNumber(),
      },
    });
    const result = await encrypt(String(user.id));
    this.mailService.sendEmailVerification(
      result,
      user.name,
      user.email,
      user.otp,
    );
    return result;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<any> {
    const user = await this.prisma.user.update({
      where: { email: dto.email },
      data: { otp: this.generateOtpNumber() },
    });
    const result = await encrypt(String(user.id));
    return result;
  }

  async resetPassword(
    resetDto: ResetPasswordDto,
    encryptedId: string,
  ): Promise<string> {
    const id = await decrypt(encryptedId);
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
        otp: Number(resetDto.otp),
        verified: true,
        blocked: false,
      },
    });

    if (!user) throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);
    const { password } = resetDto;
    const hash = await bcrypt.hash(password, Number(process.env.saltOrRounds));

    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { password: hash, otp: this.generateOtpNumber() },
    });

    return 'Password reset successful';
  }

  async verifyUser(otpDto: OtpDto, encryptedId: string): Promise<Token> {
    const id = await decrypt(encryptedId);
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
        otp: Number(otpDto.otp),
        verified: false,
        blocked: false,
      },
    });

    if (!user) throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);

    await this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        verified: true,
        otp: this.generateOtpNumber(),
      },
    });
    const token = await this.generateTokens(user);
    await this.storeRefreshToken({ id: Number(id) }, token.refresh_token);
    return token;
  }

  async storeRefreshToken(
    data: { id?: number; email?: string },
    refresh_token: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(
      refresh_token,
      Number(process.env.saltOrRounds),
    );
    await this.prisma.user.update({
      where: { ...data },
      data: {
        verified: true,
        hashed_refresh_token: hash,
      },
    });
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Token> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    if (!user.hashed_refresh_token)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const token = await this.generateTokens(user);
    await this.storeRefreshToken({ id: Number(userId) }, token.refresh_token);
    return token;
  }

  generateOtpNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async resendOtp(encryptedId: string): Promise<string> {
    const id = await decrypt(encryptedId);
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!user) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    this.mailService.sendOTP(user.name, user.email, user.otp);
    return 'Re-send OTP successful';
  }
}
