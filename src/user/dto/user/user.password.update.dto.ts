import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class UserPasswordUpdateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  password: string;
}
