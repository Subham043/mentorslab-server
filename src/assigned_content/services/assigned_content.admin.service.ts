import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssignedContentToUserCreateAdminDto,
  AssignedContentToUserCreateArrayAdminDto,
  AssignedContentGetAdminDto,
  AssignedUserToContentCreateAdminDto,
  AssignedUserToContentCreateArrayAdminDto,
} from '../dto';

@Injectable()
export class AssignedContentAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  private readonly Content = {
    id: true,
    type: true,
    heading: true,
    description: true,
  };
  constructor(private prisma: PrismaService) {}

  async createViaContent(
    dto: AssignedContentToUserCreateAdminDto,
    contentId: number,
    userId: number,
  ): Promise<AssignedContentGetAdminDto | undefined> {
    const checkAssignedContent = await this.find({
      ...dto,
      assignedContentId: contentId,
    });
    if (checkAssignedContent) return checkAssignedContent;
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(dto.assignedToId),
      },
    });
    const content = await this.prisma.content.findFirst({
      where: {
        id: Number(contentId),
      },
    });
    if (!user || !content) return undefined;
    const content_assigned = await this.prisma.contentAssigned.create({
      data: { ...dto, assignedContentId: contentId, assignedById: userId },
      include: {
        assignedBy: {
          select: this.User,
        },
        assignedTo: {
          select: this.User,
        },
        assignedContent: {
          select: this.Content,
        },
      },
    });
    return content_assigned;
  }

  async createViaContentMultiple(
    dto: AssignedContentToUserCreateArrayAdminDto,
    contentId: number,
    userId: number,
  ): Promise<AssignedContentGetAdminDto[]> {
    const arr: AssignedContentGetAdminDto[] = [];

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
    dto: AssignedUserToContentCreateAdminDto,
    assignedToId: number,
    userId: number,
  ): Promise<AssignedContentGetAdminDto | undefined> {
    const checkAssignedContent = await this.find({ ...dto, assignedToId });
    if (checkAssignedContent) return checkAssignedContent;
    const user = await this.prisma.user.findFirst({
      where: {
        id: Number(assignedToId),
      },
    });
    const content = await this.prisma.content.findFirst({
      where: {
        id: Number(dto.assignedContentId),
      },
    });
    if (!user || !content) return undefined;
    const content_assigned = await this.prisma.contentAssigned.create({
      data: { ...dto, assignedToId: assignedToId, assignedById: userId },
      include: {
        assignedBy: {
          select: this.User,
        },
        assignedTo: {
          select: this.User,
        },
        assignedContent: {
          select: this.Content,
        },
      },
    });
    return content_assigned;
  }

  async createViaUserMultiple(
    dto: AssignedUserToContentCreateArrayAdminDto,
    assignedToId: number,
    userId: number,
  ): Promise<AssignedContentGetAdminDto[]> {
    const arr: AssignedContentGetAdminDto[] = [];

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

  async findAll(): Promise<AssignedContentGetAdminDto[]> {
    return await this.prisma.contentAssigned.findMany({
      include: {
        assignedBy: {
          select: this.User,
        },
        assignedTo: {
          select: this.User,
        },
        assignedContent: {
          select: this.Content,
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<AssignedContentGetAdminDto | undefined> {
    const content_assigned = await this.prisma.contentAssigned.findFirst({
      where: {
        ...value,
      },
      include: {
        assignedBy: {
          select: this.User,
        },
        assignedTo: {
          select: this.User,
        },
        assignedContent: {
          select: this.Content,
        },
      },
    });
    return content_assigned;
  }

  async findOne(id: number): Promise<AssignedContentGetAdminDto | undefined> {
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
