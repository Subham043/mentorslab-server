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

export class AssessmentAdminCreateDto {
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
  paid: boolean;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
