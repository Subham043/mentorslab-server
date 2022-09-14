import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { GetCurrentUserIdAndRefreshToken } from 'src/common/decorator/get_current_user_id_with_refresh_token.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { UserGetDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthDto, OtpDto } from './dto';
import { Token } from './dto/token.dto';
import { AccessTokenGuard } from './guards/access_token.guard';
import { RefreshTokenGuard } from './guards/refresh_token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-in')
  @Public()
  async signIn(@Body() authDto: AuthDto): Promise<Token> {
    const result = await this.authService.validateUserLogin(authDto);
    return result;
  }

  @Post('send-otp')
  async sendOtpUser(@Body() otpDto: OtpDto): Promise<{ message: string }> {
    return await this.authService.generateAndSendOtp(otpDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@GetCurrentUserId() id: number): Promise<UserGetDto> {
    const result = await this.userService.findOne(id);
    if (!result)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetCurrentUserIdAndRefreshToken() data: any,
  ): Promise<Token> {
    return await this.authService.refreshTokens(data.id, data.refreshToken);
  }
}
