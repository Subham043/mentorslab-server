import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserProfileUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;
}
