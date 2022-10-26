import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ContentAdminCreateDto,
  ContentAdminGetDto,
  ContentAdminPaginateDto,
  ContentAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ContentAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: ContentAdminCreateDto,
    userId: number,
  ): Promise<ContentAdminGetDto | undefined> {
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

    const {
      type,
      file_path,
      heading,
      name,
      description,
      draft,
      restricted,
      paid,
      amount,
    } = dto;
    const uuid = uuidV4();
    const content = await this.prisma.content.create({
      data: {
        type,
        file_path,
        name,
        heading,
        description,
        draft,
        restricted,
        paid,
        amount,
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
    dto: ContentAdminUpdateDto,
  ): Promise<ContentAdminGetDto | undefined> {
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

    const {
      type,
      file_path,
      heading,
      name,
      description,
      draft,
      restricted,
      paid,
      amount,
    } = dto;
    const content = await this.prisma.content.update({
      where: { id: Number(id) },
      data: {
        type,
        file_path,
        name,
        heading,
        description,
        draft,
        restricted,
        paid,
        amount,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return content;
  }

  async findAll(): Promise<ContentAdminGetDto[]> {
    return await this.prisma.content.findMany({
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
  }): Promise<ContentAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.content.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      include: {
        uploadBy: {
          select: this.User,
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
  async find(value: {}): Promise<ContentAdminGetDto | undefined> {
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
        AssignedContent: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return content;
  }

  async findOne(id: number): Promise<ContentAdminGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
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

  async findOneWithAssignedContent(
    id: number,
  ): Promise<ContentAdminGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
        AssignedContent: {
          where: {
            assignedRole: 'ASSIGNED',
          },
          include: {
            assignedTo: {
              select: this.User,
            },
          },
        },
      },
    });
    return content;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.content.delete({
      where: { id: Number(id) },
    });
    if (result.type === 'PDF') {
      await this.removeFile('./uploads/pdf/' + result.file_path);
    }
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
