import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContentTypeAdmin } from './content_type.admin.enum';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasMimeType,
  HasExtension,
} from 'nestjs-form-data';
import { Transform } from 'class-transformer';

export class ContentAdminCreateDto {
  @IsNotEmpty()
  @IsEnum(ContentTypeAdmin)
  type: ContentTypeAdmin;

  @IsString()
  @IsOptional()
  file_path: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  heading: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  amount: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  restricted: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  paid: boolean;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['pdf'])
  file: MemoryStoredFile;
}
