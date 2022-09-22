import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { EmailExists } from 'src/common/validator/email_exists.validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @EmailExists()
  email: string;

  @IsNotEmpty()
  password: string;
}
