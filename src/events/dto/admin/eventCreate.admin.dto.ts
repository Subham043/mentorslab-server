import {
  IsBoolean,
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
import { UniqueUrl } from 'src/common/validator/unique_url.validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EventAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  title: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  @UniqueUrl()
  url: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  video: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  from_date: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  to_date: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  time: string;

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
  paid: boolean;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  facebook: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  instagram: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  twitter: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  linkedin: string;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  banner: MemoryStoredFile;
}
