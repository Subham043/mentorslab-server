import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidAssessmentUuidPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: string) {
    if (!value) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const content = await this.prisma.assessment.findFirst({
      where: {
        uuid: String(value),
      },
    });
    if (!content) throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    return String(value);
  }
}
