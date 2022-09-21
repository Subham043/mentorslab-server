import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ValidUserIdPipe implements PipeTransform {
  constructor(private userService: UserService) {}
  async transform(value: number) {
    if (!value || typeof value !== 'number')
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const user = await this.userService.findOne(value);
    if (!user) throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    return Number(value);
  }
}
