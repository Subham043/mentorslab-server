import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async dashboard(userId: number): Promise<any> {
    const liveSessionCount = await this.prisma.liveSessionContent.count({
      where: {
        draft: false,
      },
    });
    const contentCount = await this.prisma.content.count({
      where: {
        draft: false,
      },
    });
    const userCount = await this.prisma.user.count({
      where: {
        role: 'USER',
        verified: true,
      },
    });
    const contentData = await this.prisma.content.findMany({
      skip: 0,
      take: 4,
      orderBy: [
        {
          id: 'desc',
        },
      ],
      where: {
        draft: false,
        OR: [
          {
            paid: true,
          },
          {
            restricted: false,
          },
        ],
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
            OR: [
              {
                assignedRole: 'ASSIGNED',
              },
              {
                assignedRole: 'PURCHASED',
                PaymentInformation: {
                  some: {
                    status: 'PAID_FULL',
                  },
                },
              },
            ],
          },
          select: {
            assignedToId: true,
            assignedRole: true,
            PaymentInformation: true,
          },
        },
      },
    });
    const liveSessionData = await this.prisma.liveSessionContent.findMany({
      skip: 0,
      take: 4,
      orderBy: [
        {
          id: 'desc',
        },
      ],
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
        LiveSessionContentAssigned: {
          where: {
            requestedById: userId,
            OR: [
              {
                assignedRole: 'ASSIGNED',
              },
              {
                assignedRole: 'PURCHASED',
                PaymentInformation: {
                  some: {
                    status: 'PAID_FULL',
                  },
                },
              },
            ],
            NOT: {
              status: 'COMPLETED',
            },
          },
          select: {
            requestedById: true,
            assignedRole: true,
            status: true,
            scheduledAt: true,
            scheduledOn: true,
            PaymentInformation: true,
          },
        },
      },
    });
    return {
      data: {
        contentData,
        liveSessionData,
      },
      count: {
        userCount,
        contentCount,
        liveSessionCount,
      },
    };
  }
}
