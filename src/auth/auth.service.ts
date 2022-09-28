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
import { UserService } from 'src/user/user.service';
import { Token } from './dto/token.dto';
import * as bcrypt from 'bcrypt';
import { decrypt, encrypt } from 'src/common/hooks/encryption.hooks';
import { RegisterDto } from './dto/register.dto';
import { UserGetDto } from 'src/user/dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
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
    const user = await this.usersService.find({
      email: dto.email,
    });

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const token = await this.generateTokens(user);
    return token;
  }

  async signUp(dto: RegisterDto): Promise<any> {
    const { password } = dto;
    const hash = await bcrypt.hash(password, Number(process.env.saltOrRounds));
    dto.password = hash;
    const user = await this.usersService.create({
      ...dto,
      otp: Math.floor(1111 + Math.random() * 9999),
    });
    const result = await encrypt(String(user.id));
    return result;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<any> {
    const user = await this.usersService.update(
      {
        email: dto.email,
      },
      {
        otp: Math.floor(1111 + Math.random() * 9999),
      },
    );
    const result = await encrypt(String(user.id));
    return result;
  }

  async resetPassword(
    resetDto: ResetPasswordDto,
    encryptedId: string,
  ): Promise<string> {
    const id = await decrypt(encryptedId);
    const user = await this.usersService.find({
      id: Number(id),
      otp: Number(resetDto.otp),
      verified: true,
      blocked: false,
    });

    if (!user) throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);
    const { password } = resetDto;
    const hash = await bcrypt.hash(password, Number(process.env.saltOrRounds));

    await this.usersService.update(
      {
        id: Number(id),
      },
      {
        password: hash,
        otp: Math.floor(1111 + Math.random() * 9999),
      },
    );

    return 'Password reset successful';
  }

  async verifyUser(otpDto: OtpDto, encryptedId: string): Promise<Token> {
    const id = await decrypt(encryptedId);
    const user = await this.usersService.find({
      id: Number(id),
      otp: Number(otpDto.otp),
      verified: false,
      blocked: false,
    });

    if (!user) throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);

    await this.usersService.update(
      {
        id: Number(id),
      },
      {
        verified: true,
        otp: Math.floor(1111 + Math.random() * 9999),
      },
    );
    const token = await this.generateTokens(user);
    return token;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Token> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    // const refreshTokenMatches = await argon2.verify(
    //   user.refreshToken,
    //   refreshToken,
    // );
    // if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const token = await this.generateTokens(user);
    return token;
  }
}
