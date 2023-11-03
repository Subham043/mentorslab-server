import {
  Controller,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { TtpRegisterUserDto, PaymentVerifyUserDto } from '../dto';
import { Public } from 'src/common/decorator/public.decorator';
import { TtpUserService } from '../services/ttp.user.service';

@UseGuards(AccessTokenGuard)
@Controller('ttp-user')
export class TtpUserController {
  constructor(private eventService: TtpUserService) {}

  @Public()
  @Get('generate-payment-order')
  async getContentPaymentOrder(): Promise<any> {
    const result = await this.eventService.findOneWithPaymentOrder();
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Public()
  @Post('verify-payment')
  async verifyPayment(@Body() dto: PaymentVerifyUserDto): Promise<any> {
    const result = await this.eventService.verifyPaymentRecieved(dto);
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return { status: true, message: 'Payment & Registration Successful' };
  }

  @Public()
  @Post('validate')
  async eventRegisterValidation(@Body() dto: TtpRegisterUserDto): Promise<any> {
    return { status: true, message: 'Validation Successful' };
  }
}
