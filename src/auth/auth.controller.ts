import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  signIn(@Body() authDto: AuthDto) {
    return authDto;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Body() authDto: AuthDto) {
    return authDto;
  }
}
