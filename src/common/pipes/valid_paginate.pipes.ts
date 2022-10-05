import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ValidPaginatePipe implements PipeTransform {
  async transform(value: string) {
    if (!value) return value;
    if (!/^\d+$/.test(value))
      throw new HttpException('Invalid Type', HttpStatus.BAD_REQUEST);
    if (Number(value) < 0)
      throw new HttpException('Invalid Type', HttpStatus.BAD_REQUEST);
    return Number(value);
  }
}
