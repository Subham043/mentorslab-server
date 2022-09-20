import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;
}
