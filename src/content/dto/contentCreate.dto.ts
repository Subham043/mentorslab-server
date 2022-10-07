import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContentType } from './content_type.enum';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasMimeType,
  HasExtension,
} from 'nestjs-form-data';

export class ContentCreateDto {
  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  @IsOptional()
  file_path: string;

  @IsNotEmpty()
  heading: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBooleanString()
  draft: boolean;

  @IsOptional()
  @IsBooleanString()
  restricted: boolean;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['pdf'])
  file: MemoryStoredFile;
}
