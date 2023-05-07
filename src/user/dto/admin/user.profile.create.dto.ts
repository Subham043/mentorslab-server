import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';
import { UniqueEmail } from 'src/common/validator/unique_email.validator';
import { UniquePhone } from 'src/common/validator/unique_phone.validator';

export class UserProfileAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail()
  email: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  password: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsPhoneNumber()
  @UniquePhone()
  phone: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsBoolean()
  blocked: boolean;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsBoolean()
  verified: boolean;
}
