import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
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
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class ContentAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEnum(ContentTypeAdmin)
  type: ContentTypeAdmin;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === ContentTypeAdmin.VIDEO)
  file_path: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  heading: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  description: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'amount must be a number' })
  @ValidateIf((o) => o.paid)
  amount: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  restricted: boolean;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['pdf'])
  @ValidateIf((o) => o.type === ContentTypeAdmin.PDF)
  file: MemoryStoredFile;
}
