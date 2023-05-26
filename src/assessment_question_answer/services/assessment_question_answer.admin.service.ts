import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssessmentQuestionAnswerAdminCreateDto,
  AssessmentQuestionAnswerAdminGetDto,
  AssessmentQuestionAnswerAdminPaginateDto,
  AssessmentQuestionAnswerAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AssessmentQuestionAnswerAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: AssessmentQuestionAnswerAdminCreateDto,
    assessment_id: number,
    userId: number,
  ): Promise<AssessmentQuestionAnswerAdminGetDto | undefined> {
    let savedFileName = null;
    if (dto.image) {
      savedFileName = await this.saveFile(dto.image);
    }

    const {
      question,
      answer_a,
      answer_a_choice_id,
      answer_b,
      answer_b_choice_id,
      answer_c,
      answer_c_choice_id,
      answer_d,
      answer_d_choice_id,
      draft,
    } = dto;
    const uuid = uuidV4();
    const event = await this.prisma.assessmentQuestionAnswer.create({
      data: {
        question,
        answer_a,
        answer_a_choice_id,
        answer_b,
        answer_b_choice_id,
        answer_c,
        answer_c_choice_id,
        answer_d,
        answer_d_choice_id,
        uuid,
        draft,
        assessmentId: assessment_id,
        uploadedBy: userId,
        image: savedFileName,
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: AssessmentQuestionAnswerAdminUpdateDto,
  ): Promise<AssessmentQuestionAnswerAdminGetDto | undefined> {
    const res = await this.findOne(id);

    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      if (res.image) {
        await this.removeFile(
          './uploads/assessment_question_answer/' + res.image,
        );
      }
      await this.prisma.assessmentQuestionAnswer.update({
        where: { id: Number(id) },
        data: {
          image: savedFileName,
        },
      });
    }

    const {
      question,
      answer_a,
      answer_a_choice_id,
      answer_b,
      answer_b_choice_id,
      answer_c,
      answer_c_choice_id,
      answer_d,
      answer_d_choice_id,
      draft,
    } = dto;
    const event = await this.prisma.assessmentQuestionAnswer.update({
      where: { id: Number(id) },
      data: {
        question,
        answer_a,
        answer_a_choice_id,
        answer_b,
        answer_b_choice_id,
        answer_c,
        answer_c_choice_id,
        answer_d,
        answer_d_choice_id,
        draft,
      },
    });
    return event;
  }

  async findAll(
    assessment_id: number,
  ): Promise<AssessmentQuestionAnswerAdminGetDto[]> {
    return await this.prisma.assessmentQuestionAnswer.findMany({
      where: { assessmentId: Number(assessment_id) },
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
    assessment_id: number,
  ): Promise<AssessmentQuestionAnswerAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.assessmentQuestionAnswer.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { assessmentId: Number(assessment_id) },
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.assessmentQuestionAnswer.count({
      where: { assessmentId: Number(assessment_id) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(
    id: number,
  ): Promise<AssessmentQuestionAnswerAdminGetDto | undefined> {
    const event = await this.prisma.assessmentQuestionAnswer.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.assessmentQuestionAnswer.delete({
      where: { id: Number(id) },
    });
    await this.removeFile(
      './uploads/assessment_question_answer/' + result.image,
    );

    return 'Data deleted successfully';
  }

  async removeFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  async saveFile(file: any): Promise<string | undefined> {
    try {
      const generateFileName = fileName(file.originalName);
      await fs.appendFile(
        './uploads/assessment_question_answer/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
