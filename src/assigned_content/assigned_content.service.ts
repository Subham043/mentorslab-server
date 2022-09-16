import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignedContentCreateDto, AssignedContentCreateArrayDto, AssignedContentGetDto } from './dto';

@Injectable()
export class AssignedContentService {
    constructor(private prisma: PrismaService) { }

    async create(
        dto: AssignedContentCreateDto,
        userId: number
    ): Promise<AssignedContentGetDto | undefined> {
        const checkAssignedContent = await this.find({...dto});
        if(checkAssignedContent) return checkAssignedContent;
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

    // async createMultiple(
    //     dto: AssignedContentCreateArrayDto[],
    //     userId: number
    // ): Promise<AssignedContentGetDto[]> {
    //     let arr: AssignedContentGetDto[];

    //     dto.forEach(async (element:AssignedContentCreateDto) => {
    //         const data = await this.create(element, userId);
    //     });
    //     return arr;
    // }

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
