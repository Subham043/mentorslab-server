import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentUserGetDto, ContentUserPaginateDto } from '../dto';

@Injectable()
export class ContentUserService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<ContentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
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
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    const count = await this.prisma.content.count({
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
    });
    return {
      data,
      count,
    };
  }

  async findFreePaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<ContentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: {
        draft: false,
        paid: false,
        restricted: false,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    const count = await this.prisma.content.count({
      where: {
        draft: false,
        paid: false,
        restricted: false,
      },
    });
    return {
      data,
      count,
    };
  }

  async findPaidPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<ContentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: {
        draft: false,
        paid: true,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    const count = await this.prisma.content.count({
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

  async findOne(id: number): Promise<ContentUserGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return content;
  }
}
