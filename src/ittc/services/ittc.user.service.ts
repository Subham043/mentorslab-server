import { Injectable } from '@nestjs/common';
import {
  createRazorpayOrder,
  verifyPayment,
} from 'src/common/hooks/razorpay.hooks';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentVerifyUserDto } from '../dto';
import { v4 as uuidV4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class IttcUserService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findOneWithPaymentOrder(): Promise<any | undefined> {
    const uuid = uuidV4();
    const order = await createRazorpayOrder(500, uuid);

    return order;
  }

  async verifyPaymentRecieved(
    dto: PaymentVerifyUserDto,
  ): Promise<any | undefined> {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      signature,
      name,
      email,
      phone,
      message,
      receipt,
    } = dto;
    const checkPayment = verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      signature,
    );
    if (!checkPayment) return undefined;
    const content = await this.prisma.ittcRegistration.create({
      data: {
        paymentReferenceId: razorpayPaymentId,
        orderId: razorpayOrderId,
        name,
        email,
        phone,
        message,
        receipt,
        amount: '500',
        status: 'PAID_FULL',
      },
    });
    // this.mailService.paymentContent(payment);
    return content;
  }
}
