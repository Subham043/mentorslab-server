import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class DemoSessionUserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'name contains invalid characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @Matches(/^[a-z 0-9~%.:_\@\-\/\(\)\\\#\;\[\]\{\}\$\!\&\<\>\'\r\n+=,]+$/i, {
    message: 'name contains invalid characters',
  })
  message: string;
}
