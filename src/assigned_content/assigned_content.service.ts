import { Injectable } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AssignedContentCreateDto,
  AssignedContentCreateArrayDto,
  AssignedContentGetDto,
} from './dto';

@Injectable()
export class AssignedContentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private contentService: ContentService,
  ) {}

  async create(
    dto: AssignedContentCreateDto,
    userId: number,
  ): Promise<AssignedContentGetDto | undefined> {
    const checkAssignedContent = await this.find({ ...dto });
    if (checkAssignedContent) return checkAssignedContent;
    const user = await this.userService.findOne(dto.assignedToId);
    const content = await this.contentService.findOne(dto.assignedContentId);
    if (!user || !content) return undefined;
    const content_assigned = await this.prisma.contentAssigned.create({
      data: { ...dto, assignedById: userId },
      include: {
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedContent: {
          select: {
            id: true,
            type: true,
            heading: true,
            description: true,
          },
        },
      },
    });
    return content_assigned;
  }

  async createMultiple(
    dto: AssignedContentCreateArrayDto,
    userId: number,
  ): Promise<AssignedContentGetDto[]> {
    const arr: AssignedContentGetDto[] = [];

    for (let index = 0; index < dto.assigned_content_array.length; index++) {
      arr.push(await this.create(dto.assigned_content_array[index], userId));
    }
    const uniqueObjArray = [
      ...new Map(arr.map((item) => [item?.id, item])).values(),
    ];
    return uniqueObjArray;
  }

  async findAll(): Promise<AssignedContentGetDto[]> {
    return await this.prisma.contentAssigned.findMany({
      include: {
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedContent: {
          select: {
            id: true,
            type: true,
            heading: true,
            description: true,
          },
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<AssignedContentGetDto | undefined> {
    const content_assigned = await this.prisma.contentAssigned.findFirst({
      where: {
        ...value,
      },
      include: {
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedContent: {
          select: {
            id: true,
            type: true,
            heading: true,
            description: true,
          },
        },
      },
    });
    return content_assigned;
  }

  async findOne(id: number): Promise<AssignedContentGetDto | undefined> {
    return await this.find({ id });
  }

  async remove(id: number): Promise<string> {
    await this.prisma.contentAssigned.delete({
      where: { id: Number(id) },
    });
    return 'Access revoked successfully';
  }
}
