import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
  SetMetadata,
  Param,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { GetCurrentUserIdAndRefreshToken } from 'src/common/decorator/get_current_user_id_with_refresh_token.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { UserProfileAdminGetDto } from 'src/user/dto';
import { UserProfileAdminService } from 'src/user/services/user.admin.service';
import { AuthService } from './auth.service';
import { AuthDto, ForgotPasswordDto, OtpDto, ResetPasswordDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { Token } from './dto/token.dto';
import { AccessTokenGuard } from './guards/access_token.guard';
import { RefreshTokenGuard } from './guards/refresh_token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserProfileAdminService,
  ) {}

  @Post('sign-in')
  @Public()
  @Throttle(3, 60)
  async signIn(@Body() authDto: AuthDto): Promise<Token> {
    const result = await this.authService.validateUserLogin(authDto);
    return result;
  }

  @Post('sign-up')
  @Public()
  async signUp(@Body() authDto: RegisterDto): Promise<number> {
    const result = await this.authService.signUp(authDto);
    return result;
  }

  @Post('verify-user/:encryptedId')
  @Public()
  async verifyUser(
    @Param('encryptedId') encryptedId: string,
    @Body() otpDto: OtpDto,
  ): Promise<any> {
    const result = await this.authService.verifyUser(otpDto, encryptedId);
    return result;
  }

  @Post('reset-password/:encryptedId')
  @Public()
  async resetPassword(
    @Param('encryptedId') encryptedId: string,
    @Body() resetDto: ResetPasswordDto,
  ): Promise<string> {
    const result = await this.authService.resetPassword(resetDto, encryptedId);
    return result;
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() authDto: ForgotPasswordDto): Promise<number> {
    const result = await this.authService.forgotPassword(authDto);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  @SetMetadata('roles', ['ADMIN', 'USER'])
  async getProfile(
    @GetCurrentUserId() id: number,
  ): Promise<{ user: UserProfileAdminGetDto }> {
    const result = await this.userService.findOne(id);
    if (!result)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return { user: result };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetCurrentUserIdAndRefreshToken() data: any,
  ): Promise<Token> {
    return await this.authService.refreshTokens(data.id, data.refreshToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  async logout(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @GetCurrentUserIdAndRefreshToken() data: any,
  ): Promise<string> {
    return await this.authService.logout(data.id, data.refreshToken);
  }

  @Get('resend-otp/:encryptedId')
  @Public()
  @Throttle(1, 60)
  async resendOtp(@Param('encryptedId') encryptedId: string): Promise<string> {
    const result = await this.authService.resendOtp(encryptedId);
    return result;
  }
}
