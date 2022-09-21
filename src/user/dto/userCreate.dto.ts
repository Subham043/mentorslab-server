import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
} from 'class-validator';
import { UniqueEmail } from 'src/common/validator/unique_email.validator';
import { UniquePhone } from 'src/common/validator/unique_phone.validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueEmail)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  @Validate(UniquePhone)
  phone: string;
}
