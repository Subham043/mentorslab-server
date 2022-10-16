import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidUserIdPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: number) {
    if (!value) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const user = await this.prisma.user.findFirst({
      where: {
        id: value,
      },
    });
    if (!user) throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    return Number(value);
  }
}
