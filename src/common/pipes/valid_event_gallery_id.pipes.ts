import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidEventGalleryIdPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: number) {
    if (!value) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const event = await this.prisma.eventGallery.findFirst({
      where: {
        id: Number(value),
      },
    });
    if (!event) throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    return Number(value);
  }
}
