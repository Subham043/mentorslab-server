import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';
import { EmailExists } from 'src/common/validator/email_exists.validator';

export class AuthDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEmail()
  @EmailExists()
  email: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  password: string;
}
