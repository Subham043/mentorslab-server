import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentType } from './content_type.enum';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasExtension,
} from 'nestjs-form-data';
import { Transform } from 'class-transformer';

export class ContentUpdateDto {
  @IsOptional()
  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  @IsOptional()
  file_path: string;

  @IsOptional()
  heading: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  restricted: boolean;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['pdf'])
  file: MemoryStoredFile;
}
