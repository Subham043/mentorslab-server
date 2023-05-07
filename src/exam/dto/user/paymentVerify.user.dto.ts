import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class PaymentVerifyUserDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsString()
  signature: string;
}
