import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class UserProfileAdminUpdateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsEmail()
  email: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsString()
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsPhoneNumber()
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
