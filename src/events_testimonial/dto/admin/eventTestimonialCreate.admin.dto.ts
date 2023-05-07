import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasExtension,
} from 'nestjs-form-data';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EventTestimonialAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  designation: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
