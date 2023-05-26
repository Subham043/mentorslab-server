import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssessmentCategoryAdminCreateDto,
  AssessmentCategoryAdminGetDto,
  AssessmentCategoryAdminPaginateDto,
  AssessmentCategoryAdminUpdateDto,
} from '../dto';

@Injectable()
export class AssessmentCategoryAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: AssessmentCategoryAdminCreateDto,
    assessmentId: number,
    userId: number,
  ): Promise<AssessmentCategoryAdminGetDto | undefined> {
    const { category, choices, message, draft } = dto;
    const event = await this.prisma.assessmentCategory.create({
      data: {
        category,
        choices,
        message,
        draft,
        assessmentId: assessmentId,
        uploadedBy: userId,
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: AssessmentCategoryAdminUpdateDto,
  ): Promise<AssessmentCategoryAdminGetDto | undefined> {
    const res = await this.findOne(id);

    const { category, choices, message, draft } = dto;
    const event = await this.prisma.assessmentCategory.update({
      where: { id: Number(id) },
      data: {
        category,
        choices,
        message,
        draft,
      },
    });
    return event;
  }

  async findAll(
    assessmentId: number,
  ): Promise<AssessmentCategoryAdminGetDto[]> {
    return await this.prisma.assessmentCategory.findMany({
      where: { assessmentId: Number(assessmentId) },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findAllPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    assessmentId: number,
  ): Promise<AssessmentCategoryAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.assessmentCategory.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { assessmentId: Number(assessmentId) },
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.assessmentCategory.count({
      where: { assessmentId: Number(assessmentId) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(
    id: number,
  ): Promise<AssessmentCategoryAdminGetDto | undefined> {
    const event = await this.prisma.assessmentCategory.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);
    await this.prisma.assessmentCategory.delete({
      where: { id: Number(id) },
    });

    return 'Data deleted successfully';
  }
}
