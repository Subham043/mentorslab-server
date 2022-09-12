import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
} from 'class-validator';
import { EmailTakenRule } from 'src/utils/custom_validator/EmailTaken.validator';
import { EmailUpdateTakenRule } from 'src/utils/custom_validator/EmailUpdateTaken.validator';
import { PhoneTakenRule } from 'src/utils/custom_validator/PhoneTaken.validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(EmailTakenRule)
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  @Validate(PhoneTakenRule)
  phone: string;
}

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  @Validate(EmailUpdateTakenRule)
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;
}

export interface UserGetDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
