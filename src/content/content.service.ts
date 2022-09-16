import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentCreateDto, ContentGetDto, ContentUpdateDto } from './dto';
import * as fs from 'fs/promises';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: ContentCreateDto,
    userId: number
  ): Promise<ContentGetDto | undefined> {
    const content = await this.prisma.content.create({
      data: { ...dto, uploadedBy: userId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        
      },
    });
    return await this.findOne(content.id);
  }

  async update(
    id: number,
    dto: ContentUpdateDto,
  ): Promise<ContentGetDto | undefined> {
    const content = await this.prisma.content.update({
      where: { id: Number(id) },
      data: { ...dto },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return content;
  }

  async findAll(): Promise<ContentGetDto[]> {
    return await this.prisma.content.findMany({
      include: {
        User: true,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async find(value: {}): Promise<ContentGetDto | undefined> {
    const content = await this.prisma.content.findFirst({
      where: {
        ...value,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
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
}
