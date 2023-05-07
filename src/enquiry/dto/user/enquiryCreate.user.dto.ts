import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EnquiryUserCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'name contains invalid characters' })
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @Matches(/^[a-z 0-9~%.:_\@\-\/\(\)\\\#\;\[\]\{\}\$\!\&\<\>\'\r\n+=,]+$/i, {
    message: 'message contains invalid characters',
  })
  message: string;
}
