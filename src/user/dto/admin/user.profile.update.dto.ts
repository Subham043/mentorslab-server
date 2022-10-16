import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserProfileAdminUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsBoolean()
  verified: boolean;
}
