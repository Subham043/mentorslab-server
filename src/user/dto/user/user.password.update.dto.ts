import { IsNotEmpty, IsString } from 'class-validator';

export class UserPasswordUpdateDto {
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
