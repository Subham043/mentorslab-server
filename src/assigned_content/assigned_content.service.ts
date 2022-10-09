import { Injectable } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AssignedContentToUserCreateDto,
  AssignedContentToUserCreateArrayDto,
  AssignedContentGetDto,
  AssignedUserToContentCreateDto,
  AssignedUserToContentCreateArrayDto,
} from './dto';

@Injectable()
export class AssignedContentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private contentService: ContentService,
  ) {}

  async createViaContent(
    dto: AssignedContentToUserCreateDto,
    contentId: number,
    userId: number,
  ): Promise<AssignedContentGetDto | undefined> {
    const checkAssignedContent = await this.find({
      ...dto,
      assignedContentId: contentId,
    });
    if (checkAssignedContent) return checkAssignedContent;
    const user = await this.userService.findOne(dto.assignedToId);
    const content = await this.contentService.findOne(contentId);
    if (!user || !content) return undefined;
    const content_assigned = await this.prisma.contentAssigned.create({
      data: { ...dto, assignedContentId: contentId, assignedById: userId },
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

  async createViaContentMultiple(
    dto: AssignedContentToUserCreateArrayDto,
    contentId: number,
    userId: number,
  ): Promise<AssignedContentGetDto[]> {
    const arr: AssignedContentGetDto[] = [];

    await this.removeByContentId(contentId);

    for (let index = 0; index < dto.assigned_content_array.length; index++) {
      arr.push(
        await this.createViaContent(
          dto.assigned_content_array[index],
          contentId,
          userId,
        ),
      );
    }
    const uniqueObjArray = [
      ...new Map(arr.map((item) => [item?.id, item])).values(),
    ];
    return uniqueObjArray;
  }

  async createViaUser(
    dto: AssignedUserToContentCreateDto,
    assignedToId: number,
    userId: number,
  ): Promise<AssignedContentGetDto | undefined> {
    const checkAssignedContent = await this.find({ ...dto, assignedToId });
    if (checkAssignedContent) return checkAssignedContent;
    const user = await this.userService.findOne(assignedToId);
    const content = await this.contentService.findOne(dto.assignedContentId);
    if (!user || !content) return undefined;
    const content_assigned = await this.prisma.contentAssigned.create({
      data: { ...dto, assignedToId: assignedToId, assignedById: userId },
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

  async createViaUserMultiple(
    dto: AssignedUserToContentCreateArrayDto,
    assignedToId: number,
    userId: number,
  ): Promise<AssignedContentGetDto[]> {
    const arr: AssignedContentGetDto[] = [];

    await this.removeByAssignToId(assignedToId);

    for (let index = 0; index < dto.assigned_content_array.length; index++) {
      arr.push(
        await this.createViaUser(
          dto.assigned_content_array[index],
          assignedToId,
          userId,
        ),
      );
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

  async removeByContentId(id: number): Promise<string> {
    await this.prisma.contentAssigned.deleteMany({
      where: { assignedContentId: Number(id) },
    });
    return 'Access revoked successfully';
  }

  async removeByAssignToId(id: number): Promise<string> {
    await this.prisma.contentAssigned.deleteMany({
      where: { assignedToId: Number(id) },
    });
    return 'Access revoked successfully';
  }
}
