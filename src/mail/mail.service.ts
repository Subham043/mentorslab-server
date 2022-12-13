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

  async sessionRequested(data: any) {
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        'Mentorslab - Live Session Requested By ' + data.requestedBy.name,
      template: './session_requested', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
  }

  async scheduleSession(data: any) {
    const url = `${process.env.CLIENT_URL}/live-session-content/join/${data.liveSessionContent.uuid}`;
    await this.mailerService.sendMail({
      to: data.requestedBy.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - Live Session Scheduled On ' + data.scheduledOn,
      template: './scheduled_session', // `.hbs` extension is appended automatically
      context: {
        data,
        url,
      },
    });
  }

  async rescheduleSession(data: any) {
    const url = `${process.env.CLIENT_URL}/live-session-content/join/${data.liveSessionContent.uuid}`;
    await this.mailerService.sendMail({
      to: data.requestedBy.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - Live Session Rescheduled On ' + data.scheduledOn,
      template: './rescheduled_session', // `.hbs` extension is appended automatically
      context: {
        data,
        url,
      },
    });
  }

  async paymentContent(data: any) {
    await this.mailerService.sendMail({
      to: data.paymentDoneBy.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - Purchase Successful',
      template: './payment_content', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - Purchase Successful By ' + data.paymentDoneBy.name,
      template: './payment_content_admin', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
  }

  async paymentLiveSessionContent(data: any) {
    await this.mailerService.sendMail({
      to: data.paymentDoneBy.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - Purchase Successful',
      template: './payment_live_session_content', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Mentorslab - Purchase Successful By ' + data.paymentDoneBy.name,
      template: './payment_live_session_content_admin', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
  }

  async enquiry(data: any) {
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Mentorslab - Enquiry by ' + data.name,
      template: './enquiry', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
  }

  async demoSession(data: any) {
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Mentorslab - Demo Session requested by ' + data.name,
      template: './demo_session', // `.hbs` extension is appended automatically
      context: {
        data,
      },
    });
  }
}
