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

  async findAllPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<ContentUserPaginateDto> {
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
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        restricted: true,
        paid: true,
        AssignedContent: {
          where: {
            assignedToId: userId,
          },
          select: {
            assignedToId: true,
            assignedRole: true,
          },
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

  async findFreePaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<ContentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: {
        draft: false,
        paid: false,
        restricted: false,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        restricted: true,
        paid: true,
        AssignedContent: {
          where: {
            assignedToId: userId,
          },
          select: {
            assignedToId: true,
            assignedRole: true,
          },
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

  async findPaidPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<ContentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: {
        draft: false,
        paid: true,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        restricted: true,
        paid: true,
        AssignedContent: {
          where: {
            assignedToId: userId,
          },
          select: {
            assignedToId: true,
            assignedRole: true,
          },
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

  async findOne(
    id: number,
    userId: number,
  ): Promise<ContentUserGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
        draft: false,
      },
      select: {
        id: true,
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
          },
          select: {
            assignedToId: true,
            assignedRole: true,
          },
        },
      },
    });
    return content;
  }

  async findVideoLink(id: number): Promise<ContentUserGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
        draft: false,
      },
      select: {
        id: true,
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
        file_path: true,
      },
    });
    return { file_path: content.file_path, type: content.type };
  }

  async findFile(id: number): Promise<ContentUserGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
        draft: false,
      },
    });
    return content;
  }
}
