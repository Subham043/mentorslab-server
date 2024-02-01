import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  HasExtension,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';
import { SubscriptionEmailExists } from 'src/common/validator/subscription_email_exists.validator';
import { SubscriptionPhoneExists } from 'src/common/validator/subscription_phone_exists.validator';

export class SubscriptionRegisterUserDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'name contains invalid characters' })
  name: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEmail()
  @SubscriptionEmailExists()
  email: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9\s]*$/, { message: 'phone contains invalid characters' })
  @SubscriptionPhoneExists()
  phone: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @Matches(/^[a-z 0-9~%.:_\@\-\/\(\)\\\#\;\[\]\{\}\$\!\&\<\>\'\r\n+=,]+$/i, {
    message: 'message contains invalid characters',
  })
  message: string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['pdf'])
  cv: MemoryStoredFile;
}
