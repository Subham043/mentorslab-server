import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExamAdminCreateDto,
  ExamAdminGetDto,
  ExamAdminPaginateDto,
  ExamAdminUpdateDto,
  ExamUserGetDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ExamAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: ExamAdminCreateDto,
    userId: number,
  ): Promise<ExamAdminGetDto | undefined> {
    const savedFileName = await this.saveFile(dto.image);
    dto.file_path = savedFileName;

    const { file_path, heading, name, description, amount, draft, paid } = dto;
    const uuid = uuidV4();
    const content = await this.prisma.exam.create({
      data: {
        image: file_path,
        name,
        heading,
        description,
        draft,
        amount,
        paid,
        uploadedBy: userId,
        uuid,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return content;
  }

  async update(
    id: number,
    dto: ExamAdminUpdateDto,
  ): Promise<ExamAdminGetDto | undefined> {
    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      dto.file_path = savedFileName;
    }

    const { file_path, heading, name, description, draft, amount, paid } = dto;
    const content = await this.prisma.exam.update({
      where: { id: Number(id) },
      data: {
        image: file_path,
        name,
        heading,
        description,
        draft,
        amount,
        paid,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return content;
  }

  async findAll(): Promise<ExamAdminGetDto[]> {
    return await this.prisma.exam.findMany({
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
  }

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<ExamAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    const count = await this.prisma.exam.count({});
    return {
      data,
      count,
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<ExamAdminGetDto | undefined> {
    const content = await this.prisma.exam.findFirst({
      where: {
        ...value,
      },
      include: {
        uploadBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return content;
  }

  async findOne(id: number): Promise<ExamAdminGetDto | undefined> {
    const content = await this.prisma.exam.findFirst({
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

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.exam.delete({
      where: { id: Number(id) },
    });
    await this.removeFile(
      './uploads/live_session_content_images/' + result.image,
    );
    return 'Content deleted successfully';
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
        './uploads/live_session_content_images/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}