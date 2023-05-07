import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  HasExtension,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EventAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  heading: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  description: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
