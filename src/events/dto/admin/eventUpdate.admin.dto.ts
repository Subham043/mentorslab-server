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
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EventAdminUpdateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  title: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  url: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
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

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  banner: MemoryStoredFile;
}
