import {
  Body,
  Controller,
  Patch,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import {
  UserProfileGetDto,
  UserProfileUpdateDto,
  UserPasswordUpdateDto,
} from '../dto';
import { UserProfileService } from '../services/user.user.service';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class UserProfileController {
  constructor(private userService: UserProfileService) {}

  @Patch('update')
  async updateUserProfile(
    @GetCurrentUserId() id: number,
    @Body() userProfileUpdateDto: UserProfileUpdateDto,
  ): Promise<UserProfileGetDto> {
    const result = await this.userService.updateUserProfile(
      id,
      userProfileUpdateDto,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Patch('password/update')
  async updateUserPassword(
    @GetCurrentUserId() id: number,
    @Body() userPasswordUpdateDto: UserPasswordUpdateDto,
  ): Promise<string> {
    const result = await this.userService.updateUserPassword(
      id,
      userPasswordUpdateDto,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
