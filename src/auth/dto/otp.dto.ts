import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class OtpDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d+$/, { message: 'otp must be a number' })
  otp: string;
}
