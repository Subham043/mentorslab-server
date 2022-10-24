import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasExtension,
} from 'nestjs-form-data';
import { Transform } from 'class-transformer';
import { ContentTypeAdmin } from './content_type.admin.enum';

export class ContentAdminUpdateDto {
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

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'amount must be a number' })
  @ValidateIf((o) => o.paid)
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
