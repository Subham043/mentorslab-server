import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasExtension,
} from 'nestjs-form-data';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EventInstructorAdminUpdateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  designation: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsOptional()
  description: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsOptional()
  heading: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  facebook: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  instagram: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  twitter: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  linkedin: string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
