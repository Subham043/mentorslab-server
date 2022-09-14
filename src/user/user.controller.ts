import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserCreateDto, UserGetDto, UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles('ADMIN')
  async createUser(@Body() userCreateDto: UserCreateDto): Promise<UserGetDto> {
    const result = await this.userService.create(userCreateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Patch(':id')
  @Roles('ADMIN')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserGetDto> {
    const result = await this.userService.update(id, userUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllUser(): Promise<UserGetDto[]> {
    const result = await this.userService.findAll();
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserGetDto> {
    const result = await this.userService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
