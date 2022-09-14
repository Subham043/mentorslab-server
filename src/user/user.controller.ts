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
} from '@nestjs/common';
import { UserCreateDto, UserGetDto, UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(
    @Body() userCreateDto: UserCreateDto,
  ): Promise<{ data: UserGetDto }> {
    const result = await this.userService.create(userCreateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return { data: result };
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<{ data: UserGetDto }> {
    const result = await this.userService.update(id, userUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return { data: result };
  }

  @Get()
  async getAllUser(): Promise<{ data: UserGetDto[] }> {
    const result = await this.userService.findAll();
    return { data: result };
  }

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: UserGetDto }> {
    const result = await this.userService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return { data: result };
  }
}
