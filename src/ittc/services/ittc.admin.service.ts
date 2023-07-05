import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IttcAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async findAllRegistrationPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<any> {
    const { skip, take } = params;
    const data = await this.prisma.ittcRegistration.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        phone: true,
        email: true,
        message: true,
        receipt: true,
        orderId: true,
        amount: true,
        status: true,
        paymentReferenceId: true,
      },
    });
    const count = await this.prisma.event.count({});
    return {
      data,
      count,
    };
  }
}
