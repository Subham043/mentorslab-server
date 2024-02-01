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
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SubscriptionUserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
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
    let savedFileName = null;
    if (cv) {
      savedFileName = await this.saveFile(cv);
    }
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
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      const token = await this.authService.generateTokens(user);
      const result = {
        ...content,
        ...token,
        phone: user.phone,
        role: user.role,
        blocked: user.blocked,
        userId: user.id,
      };
      this.mailService.subscriptionContent({ ...result, new_user: false });
      return result;
    } else {
      const snakeCase = (string: string) => {
        return string
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join('_');
      };
      const password = snakeCase(name) + '@' + new Date().getFullYear();
      const hash = await bcrypt.hash(
        password,
        Number(process.env.saltOrRounds),
      );
      const userCreated = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hash,
          otp: this.authService.generateOtpNumber(),
        },
      });
      const token = await this.authService.generateTokens(userCreated);
      const result = {
        ...content,
        ...token,
        role: userCreated.role,
        blocked: userCreated.blocked,
        userId: userCreated.id,
      };
      this.mailService.subscriptionContent({
        ...result,
        new_user: true,
        password,
      });
      return result;
    }
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
