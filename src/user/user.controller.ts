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
import { UserCreateDto, UserGetDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles('ADMIN')
  async createUser(@Body() userCreateDto: UserCreateDto): Promise<UserGetDto> {
    const checkEmail = await this.userService.findByEmail(userCreateDto.email);
    if (checkEmail)
      throw new HttpException('Email is already taken', HttpStatus.BAD_REQUEST);

    if(userCreateDto.phone){
      const checkPhone = await this.userService.findByPhone(userCreateDto.phone);
      if (checkPhone)
        throw new HttpException('Phone is already taken', HttpStatus.BAD_REQUEST);
    }
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
    const user = await this.userService.findOne(id);
    if(!user)
      throw new HttpException(
        'User Not Found',
        HttpStatus.NOT_FOUND,
      );
    if (userUpdateDto.email) {
      const validateEmail = await this.userService.validateUniqueEmail(userUpdateDto.email);
      if (validateEmail.status && validateEmail.email !== user.email)
        throw new HttpException(
          'Email is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    if (userUpdateDto.phone) {
      const validatePhone = await this.userService.validateUniquePhone(userUpdateDto.phone);
      if (validatePhone.status && validatePhone.phone !== user.phone)
        throw new HttpException(
          'Phone is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }
    const result = await this.userService.update(id, userUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('USER')
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
