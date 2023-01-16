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

export class EventAdminCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @UniqueUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  video: string;

  @IsNotEmpty()
  from_date: string;

  @IsOptional()
  to_date: string;

  @IsNotEmpty()
  time: string;

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
  paid: boolean;

  @IsOptional()
  facebook: string;

  @IsOptional()
  instagram: string;

  @IsOptional()
  twitter: string;

  @IsOptional()
  linkedin: string;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  banner: MemoryStoredFile;
}
