import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async findContentAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<any> {
    const { skip, take } = params;
    const data = await this.prisma.payment.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        status: 'PAID_FULL',
      },
      select: {
        amount: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        orderId: true,
        id: true,
        paymentDoneBy: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        forContentAssigned: {
          select: {
            id: true,
            assignedContent: {
              select: {
                id: true,
                name: true,
                heading: true,
              },
            },
          },
        },
      },
    });
    const count = await this.prisma.payment.count({
      where: {
        status: 'PAID_FULL',
      },
    });
    return {
      data,
      count,
    };
  }

  async findLiveSessionContentAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<any> {
    const { skip, take } = params;
    const data = await this.prisma.paymentLiveSession.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        status: 'PAID_FULL',
      },
      select: {
        amount: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        orderId: true,
        id: true,
        paymentDoneBy: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        forLiveSessionContentAssigned: {
          select: {
            id: true,
            liveSessionContent: {
              select: {
                id: true,
                name: true,
                heading: true,
              },
            },
          },
        },
      },
    });
    const count = await this.prisma.paymentLiveSession.count({
      where: {
        status: 'PAID_FULL',
      },
    });
    return {
      data,
      count,
    };
  }

  async findExamAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<any> {
    const { skip, take } = params;
    const data = await this.prisma.paymentExam.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        status: 'PAID_FULL',
      },
      select: {
        amount: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        orderId: true,
        id: true,
        paymentDoneBy: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        forExamAssigned: {
          select: {
            id: true,
            exam: {
              select: {
                id: true,
                name: true,
                heading: true,
              },
            },
          },
        },
      },
    });
    const count = await this.prisma.paymentExam.count({
      where: {
        status: 'PAID_FULL',
      },
    });
    return {
      data,
      count,
    };
  }
}
