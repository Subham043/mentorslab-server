import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Validate,
} from 'class-validator';

export class UserUpdateDto {
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