import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class ValidContentIdPipe implements PipeTransform {
  constructor(private contentService: ContentService) {}
  async transform(value: number) {
    if (!value) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const user = await this.contentService.findOne(Number(value));
    if (!user) throw new HttpException('Invalid Id', HttpStatus.NOT_FOUND);
    return Number(value);
  }
}
