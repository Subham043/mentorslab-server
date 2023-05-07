import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class UserProfileUpdateDto {
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
}
