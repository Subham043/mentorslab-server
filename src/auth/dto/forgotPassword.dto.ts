import { IsEmail, IsNotEmpty } from 'class-validator';
import { EmailExists } from 'src/common/validator/email_exists.validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @EmailExists()
  email: string;
}
