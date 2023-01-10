import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class EventRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'name contains invalid characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9\s]*$/, { message: 'phone contains invalid characters' })
  phone: string;

  @IsNotEmpty()
  @Matches(/^[a-z 0-9~%.:_\@\-\/\(\)\\\#\;\[\]\{\}\$\!\&\<\>\'\r\n+=,]+$/i, {
    message: 'message contains invalid characters',
  })
  message: string;
}
