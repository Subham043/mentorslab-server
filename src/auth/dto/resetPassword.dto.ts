import { IsNotEmpty, IsString } from 'class-validator';
import { OtpDto } from './otp.dto';
import { Transform } from 'class-transformer';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class ResetPasswordDto extends OtpDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  password: string;
}
