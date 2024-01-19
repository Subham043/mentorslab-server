import {
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { PaymentVerifyUserDto, SubscriptionRegisterUserDto } from '../dto';
import { Public } from 'src/common/decorator/public.decorator';
import { SubscriptionUserService } from '../services/subscription.user.service';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('subscription-user')
export class SubscriptionUserController {
  constructor(private subscriptionService: SubscriptionUserService) {}

  @Public()
  @Get('generate-payment-order')
  async getContentPaymentOrder(): Promise<any> {
    const result = await this.subscriptionService.findOneWithPaymentOrder();
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Public()
  @FormDataRequest()
  @Post('verify-payment')
  async verifyPayment(@Body() dto: PaymentVerifyUserDto): Promise<any> {
    const result = await this.subscriptionService.verifyPaymentRecieved(dto);
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return {
      status: true,
      order: result,
      message: 'Payment & Subscription Successful',
    };
  }

  @Public()
  @FormDataRequest()
  @Post('validate')
  async eventRegisterValidation(
    @Body() dto: SubscriptionRegisterUserDto,
  ): Promise<any> {
    return { status: true, message: 'Validation Successful' };
  }
}
