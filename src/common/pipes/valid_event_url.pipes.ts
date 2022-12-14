import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidEventUrlPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: string) {
    if (!value) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const event = await this.prisma.event.findFirst({
      where: {
        url: String(value),
      },
    });
    if (!event) throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    return String(value);
  }
}
