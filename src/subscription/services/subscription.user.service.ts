import { Injectable } from '@nestjs/common';
import {
  createRazorpayOrder,
  verifyPayment,
} from 'src/common/hooks/razorpay.hooks';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentVerifyUserDto } from '../dto';
import { v4 as uuidV4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { fileName } from 'src/common/hooks/fileName.hooks';
import * as fs from 'fs/promises';

@Injectable()
export class SubscriptionUserService {
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
      cv,
    } = dto;
    const checkPayment = verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      signature,
    );
    if (!checkPayment) return undefined;
    const savedFileName = await this.saveFile(cv);
    const content = await this.prisma.subscription.create({
      data: {
        name,
        email,
        phone,
        message,
        receipt,
        amount: '500',
        paymentReferenceId: razorpayPaymentId,
        orderId: razorpayOrderId,
        cv: savedFileName,
      },
    });
    // this.mailService.paymentContent(payment);
    return content;
  }

  async saveFile(file: any): Promise<string | undefined> {
    try {
      const generateFileName = fileName(file.originalName);
      await fs.appendFile(
        './uploads/subscription_cv/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
