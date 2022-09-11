import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  createUser(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @Patch('update/:id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.userService.update(id, userDto);
  }
}
