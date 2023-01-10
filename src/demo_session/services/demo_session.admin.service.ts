import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemoSessionAdminPaginateDto } from '../dto';

@Injectable()
export class DemoSessionAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<DemoSessionAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.demoSession.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.enquiries.count({});
    return {
      data,
      count,
    };
  }
}
