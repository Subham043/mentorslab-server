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

  async findOne(url: string): Promise<EventUserGetDto | undefined> {
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

  async findOneWithPaymentOrder(
    id: string,
    userId: number,
  ): Promise<any | undefined> {
    const contentCheckFirst = await this.prisma.content.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        restricted: true,
        paid: true,
        amount: true,
        AssignedContent: {
          where: {
            assignedToId: userId,
            assignedRole: 'ASSIGNED',
          },
          select: {
            assignedToId: true,
            assignedRole: true,
          },
        },
      },
    });
    if (contentCheckFirst.paid === false) return undefined;
    if (
      contentCheckFirst.AssignedContent &&
      contentCheckFirst.AssignedContent.length !== 0
    )
      return undefined;
    const contentCheckSecond = await this.prisma.content.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        restricted: true,
        paid: true,
        amount: true,
        AssignedContent: {
          where: {
            assignedToId: userId,
            assignedRole: 'PURCHASED',
          },
          select: {
            assignedToId: true,
            assignedRole: true,
            PaymentInformation: {
              where: {
                paymentBy: userId,
              },
            },
          },
        },
      },
    });
    if (contentCheckSecond.paid === false) return undefined;
    if (
      contentCheckSecond.AssignedContent &&
      contentCheckSecond.AssignedContent.length === 0
    ) {
      const uuid = uuidV4();
      const order = await createRazorpayOrder(contentCheckSecond.amount, uuid);
      const content = await this.prisma.content.findFirst({
        where: {
          uuid: id,
          draft: false,
        },
        select: {
          id: true,
          uuid: true,
          createdAt: true,
          updatedAt: true,
          type: true,
          name: true,
          heading: true,
          description: true,
          draft: true,
          restricted: true,
          paid: true,
          amount: true,
          AssignedContent: {
            where: {
              assignedToId: userId,
              assignedRole: 'ASSIGNED',
            },
            select: {
              assignedToId: true,
              assignedRole: true,
            },
          },
        },
      });
      const content_assigned = await this.prisma.contentAssigned.create({
        data: {
          assignedContentId: content.id,
          assignedToId: userId,
          assignedRole: 'PURCHASED',
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payment = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: content.amount,
          receipt: order.receipt,
          paymentBy: userId,
          forContentAssignedId: content_assigned.id,
        },
      });

      return order;
    } else if (
      contentCheckSecond.AssignedContent &&
      contentCheckSecond.AssignedContent.length !== 0 &&
      contentCheckSecond.AssignedContent[0].PaymentInformation[0].status !==
        'PENDING'
    ) {
      return undefined;
    } else {
      return {
        id: contentCheckSecond.AssignedContent[0].PaymentInformation[0].orderId,
        amount:
          contentCheckSecond.AssignedContent[0].PaymentInformation[0].amount,
        currency: 'INR',
      };
    }
  }

  async verifyPaymentRecieved(
    dto: PaymentVerifyUserDto,
    userId: number,
  ): Promise<any | undefined> {
    const { razorpayOrderId, razorpayPaymentId, signature } = dto;
    const checkPayment = verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      signature,
    );
    if (!checkPayment) return undefined;
    const content = await this.prisma.payment.update({
      where: { orderId: razorpayOrderId },
      data: {
        paymentReferenceId: razorpayPaymentId,
        status: 'PAID_FULL',
      },
    });
    const payment = await this.prisma.payment.findFirst({
      where: {
        orderId: razorpayOrderId,
        status: 'PAID_FULL',
        id: content.id,
      },
      select: {
        orderId: true,
        amount: true,
        paymentReferenceId: true,
        updatedAt: true,
        createdAt: true,
        paymentDoneBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        forContentAssigned: {
          select: {
            assignedContent: {
              select: {
                id: true,
                uuid: true,
                name: true,
                heading: true,
              },
            },
          },
        },
      },
    });
    this.mailService.paymentContent(payment);
    return content;
  }
}
