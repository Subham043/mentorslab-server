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
import { IttcRegisterUserDto, PaymentVerifyUserDto } from '../dto';
import { Public } from 'src/common/decorator/public.decorator';
import { IttcUserService } from '../services/ittc.user.service';

@UseGuards(AccessTokenGuard)
@Controller('ittc-user')
export class IttcUserController {
  constructor(private eventService: IttcUserService) {}

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
  async eventRegisterValidation(
    @Body() dto: IttcRegisterUserDto,
  ): Promise<any> {
    return { status: true, message: 'Validation Successful' };
  }
}
