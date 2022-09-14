import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
