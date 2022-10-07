import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ContentCreateDto,
  ContentGetDto,
  ContentPaginateDto,
  ContentUpdateDto,
} from './dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: ContentCreateDto,
    userId: number,
  ): Promise<ContentGetDto | undefined> {
    if (dto.type === 'PDF' && !dto.file) {
      throw new HttpException('PDF File is required', HttpStatus.BAD_REQUEST);
    } else if (dto.type === 'PDF' && dto.file) {
      const savedFileName = await this.saveFile(dto.file);
      dto.file_path = savedFileName;
    } else if (dto.type !== 'PDF' && dto.file) {
      throw new HttpException(
        'File cannot be attached to this request',
        HttpStatus.BAD_REQUEST,
      );
    } else if (dto.type !== 'PDF' && !dto.file_path) {
      throw new HttpException('Video link is required', HttpStatus.BAD_REQUEST);
    }

    const { type, file_path, heading, description } = dto;
    const content = await this.prisma.content.create({
      data: { type, file_path, heading, description, uploadedBy: userId },
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

  async update(
    id: number,
    dto: ContentUpdateDto,
  ): Promise<ContentGetDto | undefined> {
    const res = await this.findOne(id);

    if (dto.type === 'PDF' && res.type !== 'PDF' && !dto.file) {
      throw new HttpException('PDF File is required', HttpStatus.BAD_REQUEST);
    } else if (dto.type === 'PDF' && res.type !== 'PDF' && dto.file) {
      const savedFileName = await this.saveFile(dto.file);
      dto.file_path = savedFileName;
      await this.removeFile('./uploads/pdf/' + res.file_path);
    } else if (res.type === 'PDF' && dto.file) {
      const savedFileName = await this.saveFile(dto.file);
      dto.file_path = savedFileName;
      await this.removeFile('./uploads/pdf/' + res.file_path);
    }

    if (dto.type !== 'PDF' && dto.file) {
      throw new HttpException(
        'File cannot be attached to this request',
        HttpStatus.BAD_REQUEST,
      );
    } else if (dto.type !== 'PDF' && res.type === 'PDF' && !dto.file_path) {
      throw new HttpException('Video link is required', HttpStatus.BAD_REQUEST);
    }

    const { type, file_path, heading, description } = dto;
    const content = await this.prisma.content.update({
      where: { id: Number(id) },
      data: { type, file_path, heading, description },
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

  async findAll(): Promise<ContentGetDto[]> {
    return await this.prisma.content.findMany({
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
  }

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<ContentPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
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
    const count = await this.prisma.content.count({});
    return {
      data,
      count,
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<ContentGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
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

  async findOne(id: number): Promise<ContentGetDto | undefined> {
    return await this.find({ id });
  }

  async remove(id: number): Promise<string> {
    await this.prisma.content.delete({
      where: { id: Number(id) },
    });
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
      await fs.appendFile('./uploads/pdf/' + generateFileName, file.buffer);
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
