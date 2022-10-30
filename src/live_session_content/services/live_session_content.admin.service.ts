import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LiveSessionContentAdminCreateDto,
  LiveSessionContentAdminGetDto,
  LiveSessionContentAdminPaginateDto,
  LiveSessionContentAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class LiveSessionContentAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: LiveSessionContentAdminCreateDto,
    userId: number,
  ): Promise<LiveSessionContentAdminGetDto | undefined> {
    const savedFileName = await this.saveFile(dto.image);
    dto.file_path = savedFileName;

    const { file_path, heading, name, description, amount, draft, paid } = dto;
    const uuid = uuidV4();
    const content = await this.prisma.liveSessionContent.create({
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
    dto: LiveSessionContentAdminUpdateDto,
  ): Promise<LiveSessionContentAdminGetDto | undefined> {
    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      dto.file_path = savedFileName;
    }

    const { file_path, heading, name, description, draft, amount, paid } = dto;
    const content = await this.prisma.liveSessionContent.update({
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

  async findAll(): Promise<LiveSessionContentAdminGetDto[]> {
    return await this.prisma.liveSessionContent.findMany({
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
  }): Promise<LiveSessionContentAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.liveSessionContent.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    const count = await this.prisma.liveSessionContent.count({});
    return {
      data,
      count,
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<LiveSessionContentAdminGetDto | undefined> {
    const content = await this.prisma.liveSessionContent.findFirst({
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

  async findOne(
    id: number,
  ): Promise<LiveSessionContentAdminGetDto | undefined> {
    const content = await this.prisma.liveSessionContent.findFirst({
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
    await this.prisma.liveSessionContent.delete({
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
