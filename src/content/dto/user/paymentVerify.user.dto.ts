import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentVerifyUserDto {
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}
