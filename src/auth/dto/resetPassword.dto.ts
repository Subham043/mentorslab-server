import { IsNotEmpty, IsString } from 'class-validator';
import { OtpDto } from './otp.dto';

export class ResetPasswordDto extends OtpDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
