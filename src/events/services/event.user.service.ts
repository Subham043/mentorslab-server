import { Injectable } from '@nestjs/common';
import {
  createRazorpayOrder,
  verifyPayment,
} from 'src/common/hooks/razorpay.hooks';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EventUserGetDto,
  EventUserPaginateDto,
  PaymentVerifyUserDto,
  EventMainUserGetDto,
  EventRegisterUserDto,
} from '../dto';
import { v4 as uuidV4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EventUserService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<EventUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.event.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
      },
      select: {
        title: true,
        video: true,
        from_date: true,
        url: true,
        to_date: true,
        time: true,
        draft: true,
        paid: true,
        amount: true,
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        banner: true,
      },
    });
    const count = await this.prisma.event.count({
      where: {
        draft: false,
      },
    });
    return {
      data,
      count,
    };
  }

  async getLatest(): Promise<EventUserGetDto[]> {
    const data = await this.prisma.event.findMany({
      skip: 0,
      take: 3,
      where: {
        draft: false,
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        title: true,
        video: true,
        from_date: true,
        url: true,
        to_date: true,
        time: true,
        draft: true,
        paid: true,
        amount: true,
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        banner: true,
      },
    });
    return data;
  }

  async findOne(url: string): Promise<EventMainUserGetDto | undefined> {
    const event = await this.prisma.event.findFirst({
      where: {
        url: url,
        draft: false,
      },
      select: {
        title: true,
        video: true,
        from_date: true,
        url: true,
        to_date: true,
        time: true,
        draft: true,
        paid: true,
        amount: true,
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        banner: true,
        EventCallToAction: {
          select: {
            heading: true,
            description: true,
          },
        },
        EventAbout: {
          select: {
            heading: true,
            description: true,
            image: true,
          },
        },
        EventTestimonial: {
          select: {
            name: true,
            designation: true,
            message: true,
            image: true,
          },
        },
        EventInstructor: {
          select: {
            name: true,
            designation: true,
            description: true,
            heading: true,
            image: true,
            facebook: true,
            instagram: true,
            twitter: true,
            linkedin: true,
          },
        },
        EventSchedule: {
          select: {
            title: true,
            description: true,
            heading: true,
          },
        },
        EventGallery: {
          select: {
            image: true,
          },
        },
      },
    });
    return event;
  }

  async findFile(url: string): Promise<EventUserGetDto | undefined> {
    const event = await this.prisma.event.findFirst({
      where: {
        url: url,
        draft: false,
      },
    });
    return event;
  }

  async findOneWithPaymentOrder(id: string): Promise<any | undefined> {
    const contentCheckFirst = await this.prisma.event.findFirst({
      where: {
        url: id,
        draft: false,
      },
      select: {
        id: true,
        title: true,
        draft: true,
        paid: true,
        amount: true,
      },
    });
    if (!contentCheckFirst) return undefined;
    if (contentCheckFirst.paid === false) return undefined;
    const uuid = uuidV4();
    const order = await createRazorpayOrder(contentCheckFirst.amount, uuid);

    return order;
  }

  async verifyPaymentRecieved(
    dto: PaymentVerifyUserDto,
    url: string,
  ): Promise<any | undefined> {
    const contentCheckFirst = await this.prisma.event.findFirst({
      where: {
        url: url,
        draft: false,
      },
      select: {
        id: true,
        title: true,
        draft: true,
        paid: true,
        amount: true,
      },
    });
    if (!contentCheckFirst) return undefined;
    if (contentCheckFirst.paid === false) return undefined;
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
    const content = await this.prisma.eventRegistration.create({
      data: {
        paymentReferenceId: razorpayPaymentId,
        orderId: razorpayOrderId,
        name,
        email,
        phone,
        message,
        receipt,
        amount: contentCheckFirst.amount,
        eventId: contentCheckFirst.id,
      },
    });
    // this.mailService.paymentContent(payment);
    return content;
  }

  async eventRegister(
    dto: EventRegisterUserDto,
    url: string,
  ): Promise<any | undefined> {
    const contentCheckFirst = await this.prisma.event.findFirst({
      where: {
        url: url,
        draft: false,
      },
      select: {
        id: true,
        title: true,
        draft: true,
        paid: true,
        amount: true,
      },
    });
    if (!contentCheckFirst) return undefined;
    if (contentCheckFirst.paid === true) return undefined;
    const { name, email, phone, message } = dto;
    const content = await this.prisma.eventRegistration.create({
      data: {
        name,
        email,
        phone,
        message,
        eventId: contentCheckFirst.id,
      },
    });
    // this.mailService.paymentContent(payment);
    return content;
  }
}
