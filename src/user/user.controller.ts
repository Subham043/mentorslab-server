import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Get
} from '@nestjs/common';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() userCreateDto: UserCreateDto) {
    return this.userService.create(userCreateDto);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userUpdateDto: UserUpdateDto) {
    return this.userService.update(id, userUpdateDto);
  }
  
  @Get()
  getAllUser() {
    return this.userService.findAll();
  }
  
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post('send-otp')
  sendOtpUser(@Body() userCreateDto: UserCreateDto) {
    return this.userService.generateAndSendOtp(userCreateDto.email);
  }
}
