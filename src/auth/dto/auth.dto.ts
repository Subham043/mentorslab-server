import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^\d+$/, { message: 'otp must be a number' })
  otp: string;
}
