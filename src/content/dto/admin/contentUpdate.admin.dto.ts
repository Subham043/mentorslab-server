import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasExtension,
} from 'nestjs-form-data';
import { Transform } from 'class-transformer';
import { ContentTypeAdmin } from './content_type.admin.enum';

export class ContentAdminUpdateDto {
  @IsOptional()
  @IsEnum(ContentTypeAdmin)
  type: ContentTypeAdmin;

  @IsString()
  @IsOptional()
  file_path: string;

  @IsOptional()
  name: string;

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
