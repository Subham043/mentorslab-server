import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnquiryAdminPaginateDto } from '../dto';

@Injectable()
export class EnquiryAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<EnquiryAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.enquiries.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
    });
    const count = await this.prisma.enquiries.count({});
    return {
      data,
      count,
    };
  }
}
