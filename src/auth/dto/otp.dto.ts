import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d+$/, { message: 'otp must be a number' })
  otp: string;
}
