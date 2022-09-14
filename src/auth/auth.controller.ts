import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserCreateDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthDto, OtpDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  // @UseGuards(LocalAuthGuard)
  async signIn(@Body() authDto: AuthDto) {
    const result = await this.authService.validateUserLogin(authDto);
    return result;
  }

  @Post('send-otp')
  async sendOtpUser(@Body() otpDto: OtpDto): Promise<{ message: string }> {
    return await this.authService.generateAndSendOtp(otpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Body() authDto: AuthDto) {
    return authDto;
  }
}
