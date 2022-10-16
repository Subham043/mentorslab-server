import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UniqueEmail } from 'src/common/validator/unique_email.validator';
import { UniquePhone } from 'src/common/validator/unique_phone.validator';

export class UserProfileAdminCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  @UniquePhone()
  phone: string;

  @IsOptional()
  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsBoolean()
  verified: boolean;
}
