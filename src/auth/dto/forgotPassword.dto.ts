import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';
import { EmailExists } from 'src/common/validator/email_exists.validator';

export class ForgotPasswordDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEmail()
  @EmailExists()
  email: string;
}
