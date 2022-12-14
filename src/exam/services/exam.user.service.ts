import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExamUserGetDto,
  ExamUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { v4 as uuidV4 } from 'uuid';
import {
  createRazorpayOrder,
  verifyPayment,
} from 'src/common/hooks/razorpay.hooks';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ExamUserService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findAllPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<ExamUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        // LiveSessionContentAssigned: {
        //   where: {
        //     requestedById: userId,
        //     OR: [
        //       {
        //         assignedRole: 'ASSIGNED',
        //       },
        //       {
        //         assignedRole: 'PURCHASED',
        //         PaymentInformation: {
        //           some: {
        //             status: 'PAID_FULL',
        //           },
        //         },
        //       },
        //     ],
        //     NOT: {
        //       status: 'COMPLETED',
        //     },
        //   },
        //   select: {
        //     requestedById: true,
        //     assignedRole: true,
        //     status: true,
        //     scheduledAt: true,
        //     scheduledOn: true,
        //     PaymentInformation: true,
        //   },
        // },
      },
    });
    const count = await this.prisma.exam.count({
      where: {
        draft: false,
      },
    });
    return {
      data,
      count,
    };
  }

  async findFreePaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<ExamUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
        paid: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        // LiveSessionContentAssigned: {
        //   where: {
        //     requestedById: userId,
        //     OR: [
        //       {
        //         assignedRole: 'ASSIGNED',
        //       },
        //       {
        //         assignedRole: 'PURCHASED',
        //         PaymentInformation: {
        //           some: {
        //             status: 'PAID_FULL',
        //           },
        //         },
        //       },
        //     ],
        //     NOT: {
        //       status: 'COMPLETED',
        //     },
        //   },
        //   select: {
        //     requestedById: true,
        //     status: true,
        //     assignedRole: true,
        //     scheduledAt: true,
        //     scheduledOn: true,
        //     PaymentInformation: true,
        //   },
        // },
      },
    });
    const count = await this.prisma.exam.count({
      where: {
        draft: false,
        paid: false,
      },
    });
    return {
      data,
      count,
    };
  }

  async findPaidPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<ExamUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
        paid: true,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        // LiveSessionContentAssigned: {
        //   where: {
        //     requestedById: userId,
        //     PaymentInformation: {
        //       some: {
        //         status: 'PAID_FULL',
        //       },
        //     },
        //     NOT: {
        //       status: 'COMPLETED',
        //     },
        //   },
        //   select: {
        //     requestedById: true,
        //     assignedRole: true,
        //     status: true,
        //     scheduledAt: true,
        //     scheduledOn: true,
        //     PaymentInformation: true,
        //   },
        // },
      },
    });
    const count = await this.prisma.exam.count({
      where: {
        draft: false,
        paid: true,
      },
    });
    return {
      data,
      count,
    };
  }

  async findOne(
    id: string,
    userId: number,
  ): Promise<ExamUserGetDto | undefined> {
    const content = await this.prisma.exam.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        // LiveSessionContentAssigned: {
        //   where: {
        //     requestedById: userId,
        //     OR: [
        //       {
        //         assignedRole: 'ASSIGNED',
        //       },
        //       {
        //         assignedRole: 'PURCHASED',
        //         PaymentInformation: {
        //           some: {
        //             status: 'PAID_FULL',
        //           },
        //         },
        //       },
        //     ],
        //     NOT: {
        //       status: 'COMPLETED',
        //     },
        //   },
        //   select: {
        //     requestedById: true,
        //     status: true,
        //     assignedRole: true,
        //     scheduledAt: true,
        //     scheduledOn: true,
        //     zoom: true,
        //     id: true,
        //     PaymentInformation: true,
        //   },
        // },
      },
    });
    return content;
  }

  async findFile(id: string): Promise<ExamUserGetDto | undefined> {
    const content = await this.prisma.exam.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
    });
    return content;
  }

  // async findOneWithPaymentOrder(
  //   id: string,
  //   userId: number,
  // ): Promise<any | undefined> {
  //   const contentCheckSecond = await this.prisma.exam.findFirst({
  //     where: {
  //       uuid: id,
  //       draft: false,
  //     },
  //     select: {
  //       id: true,
  //       uuid: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       name: true,
  //       heading: true,
  //       description: true,
  //       draft: true,
  //       paid: true,
  //       amount: true,
  //       // LiveSessionContentAssigned: {
  //       //   where: {
  //       //     requestedById: userId,
  //       //     assignedRole: 'PURCHASED',
  //       //     PaymentInformation: {
  //       //       some: {
  //       //         status: 'PAID_FULL',
  //       //       },
  //       //     },
  //       //     NOT: {
  //       //       status: 'COMPLETED',
  //       //     },
  //       //   },
  //       //   select: {
  //       //     requestedById: true,
  //       //     assignedRole: true,
  //       //     status: true,
  //       //     PaymentInformation: {
  //       //       where: {
  //       //         paymentBy: userId,
  //       //       },
  //       //     },
  //       //   },
  //       // },
  //     },
  //   });
  //   if (contentCheckSecond.paid === false) return undefined;
  //   if (
  //     contentCheckSecond.LiveSessionContentAssigned &&
  //     contentCheckSecond.LiveSessionContentAssigned.length === 0
  //   ) {
  //     const uuid = uuidV4();
  //     const order = await createRazorpayOrder(contentCheckSecond.amount, uuid);
  //     const content = await this.prisma.liveSessionContent.findFirst({
  //       where: {
  //         uuid: id,
  //         draft: false,
  //       },
  //       select: {
  //         id: true,
  //         uuid: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         name: true,
  //         heading: true,
  //         description: true,
  //         paid: true,
  //         amount: true,
  //         LiveSessionContentAssigned: {
  //           where: {
  //             requestedById: userId,
  //           },
  //           select: {
  //             requestedById: true,
  //           },
  //         },
  //       },
  //     });
  //     const content_assigned =
  //       await this.prisma.liveSessionContentAssigned.create({
  //         data: {
  //           liveSessionContentId: content.id,
  //           requestedById: userId,
  //           assignedRole: 'PURCHASED',
  //         },
  //       });
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const payment = await this.prisma.paymentLiveSession.create({
  //       data: {
  //         orderId: order.id,
  //         amount: content.amount,
  //         receipt: order.receipt,
  //         paymentBy: userId,
  //         forLiveSessionContentAssignedId: content_assigned.id,
  //       },
  //     });

  //     return order;
  //   } else if (
  //     contentCheckSecond.LiveSessionContentAssigned &&
  //     contentCheckSecond.LiveSessionContentAssigned.length !== 0 &&
  //     contentCheckSecond.LiveSessionContentAssigned[0].PaymentInformation[0]
  //       .status !== 'PENDING'
  //   ) {
  //     return undefined;
  //   } else {
  //     return {
  //       id: contentCheckSecond.LiveSessionContentAssigned[0]
  //         .PaymentInformation[0].orderId,
  //       amount:
  //         contentCheckSecond.LiveSessionContentAssigned[0].PaymentInformation[0]
  //           .amount,
  //       currency: 'INR',
  //     };
  //   }
  // }

  // async verifyPaymentRecieved(
  //   dto: PaymentVerifyUserDto,
  //   userId: number,
  // ): Promise<any | undefined> {
  //   const { razorpayOrderId, razorpayPaymentId, signature } = dto;
  //   const checkPayment = verifyPayment(
  //     razorpayOrderId,
  //     razorpayPaymentId,
  //     signature,
  //   );
  //   if (!checkPayment) return undefined;
  //   const content = await this.prisma.paymentLiveSession.update({
  //     where: { orderId: razorpayOrderId },
  //     data: {
  //       paymentReferenceId: razorpayPaymentId,
  //       status: 'PAID_FULL',
  //     },
  //   });
  //   const payment = await this.prisma.paymentLiveSession.findFirst({
  //     where: {
  //       orderId: razorpayOrderId,
  //       id: content.id,
  //       paymentReferenceId: razorpayPaymentId,
  //       status: 'PAID_FULL',
  //     },
  //     select: {
  //       orderId: true,
  //       amount: true,
  //       paymentReferenceId: true,
  //       updatedAt: true,
  //       createdAt: true,
  //       paymentDoneBy: {
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //         },
  //       },
  //       forLiveSessionContentAssigned: {
  //         select: {
  //           liveSessionContent: {
  //             select: {
  //               id: true,
  //               uuid: true,
  //               name: true,
  //               heading: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   this.mailService.paymentLiveSessionContent(payment);
  //   return content;
  // }
}
