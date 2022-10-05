import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { ValidUserIdPipe } from 'src/common/pipes/valid_user_id.pipes';
import {
  UserCreateDto,
  UserGetDto,
  UserPaginateDto,
  UserUpdateDto,
} from './dto';
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
    @Param('id', ValidUserIdPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserGetDto> {
    const result = await this.userService.updateUser(id, userUpdateDto);
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

  @Get('paginate')
  @Roles('ADMIN')
  async getAllUserPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<UserPaginateDto> {
    const result = await this.userService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getUser(@Param('id', ValidUserIdPipe) id: number): Promise<UserGetDto> {
    const result = await this.userService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteUser(@Param('id', ValidUserIdPipe) id: number): Promise<string> {
    const res = await this.userService.remove(id);
    return 'User deleted successfully';
  }
}
