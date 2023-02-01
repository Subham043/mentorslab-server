import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExamQuestionAnswerAdminCreateDto,
  ExamQuestionAnswerAdminGetDto,
  ExamQuestionAnswerAdminPaginateDto,
  ExamQuestionAnswerAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ExamQuestionAnswerAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: ExamQuestionAnswerAdminCreateDto,
    exam_id: number,
    userId: number,
  ): Promise<ExamQuestionAnswerAdminGetDto | undefined> {
    let savedFileName = null;
    if (dto.image) {
      savedFileName = await this.saveFile(dto.image);
    }

    const {
      question,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      duration,
      draft,
    } = dto;
    const uuid = uuidV4();
    const event = await this.prisma.examQuestionAnswer.create({
      data: {
        question,
        answer_a,
        answer_b,
        answer_c,
        answer_d,
        duration,
        uuid,
        draft,
        examId: exam_id,
        uploadedBy: userId,
        image: savedFileName,
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: ExamQuestionAnswerAdminUpdateDto,
  ): Promise<ExamQuestionAnswerAdminGetDto | undefined> {
    const res = await this.findOne(id);

    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      if (res.image) {
        await this.removeFile('./uploads/exam_question_answer/' + res.image);
      }
      await this.prisma.examQuestionAnswer.update({
        where: { id: Number(id) },
        data: {
          image: savedFileName,
        },
      });
    }

    const {
      question,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      duration,
      draft,
    } = dto;
    const event = await this.prisma.examQuestionAnswer.update({
      where: { id: Number(id) },
      data: {
        question,
        answer_a,
        answer_b,
        answer_c,
        answer_d,
        duration,
        draft,
      },
    });
    return event;
  }

  async findAll(exam_id: number): Promise<ExamQuestionAnswerAdminGetDto[]> {
    return await this.prisma.examQuestionAnswer.findMany({
      where: { examId: Number(exam_id) },
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
    exam_id: number,
  ): Promise<ExamQuestionAnswerAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.examQuestionAnswer.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { examId: Number(exam_id) },
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.examQuestionAnswer.count({
      where: { examId: Number(exam_id) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(
    id: number,
  ): Promise<ExamQuestionAnswerAdminGetDto | undefined> {
    const event = await this.prisma.examQuestionAnswer.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.examQuestionAnswer.delete({
      where: { id: Number(id) },
    });
    await this.removeFile('./uploads/exam_question_answer/' + result.image);

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
        './uploads/exam_question_answer/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
