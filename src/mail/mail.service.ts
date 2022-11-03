import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation() {
    const url = `example.com/auth/confirm?token=123`;

    await this.mailerService.sendMail({
      to: 'subham.5ine@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        name: 'subham saha',
        url,
      },
    });
  }

  async sendEmailVerification(
    encryptedId: string,
    name: string,
    email: string,
    otp: number,
  ) {
    const url = `${process.env.CLIENT_URL}/auth/verify-user/${encryptedId}`;

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Mentorslab! Verify your Email',
      template: './email_verification', // `.hbs` extension is appended automatically
      context: {
        name,
        url,
        otp,
      },
    });
  }

  async sendOTP(name: string, email: string, otp: number) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - New OTP',
      template: './resend_otp', // `.hbs` extension is appended automatically
      context: {
        name,
        otp,
      },
    });
  }
}
