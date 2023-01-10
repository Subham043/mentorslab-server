import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EventGalleryAdminCreateDto,
  EventGalleryAdminGetDto,
  EventGalleryAdminPaginateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';

@Injectable()
export class EventGalleryAdminService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventGalleryAdminCreateDto,
    event_id: number,
  ): Promise<EventGalleryAdminGetDto | undefined> {
    const savedFileName = await this.saveFile(dto.image);

    const event = await this.prisma.eventGallery.create({
      data: {
        eventId: event_id,
        image: savedFileName,
      },
    });
    return event;
  }

  async findAll(event_id: number): Promise<EventGalleryAdminGetDto[]> {
    return await this.prisma.eventGallery.findMany({
      where: { eventId: Number(event_id) },
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
    event_id: number,
  ): Promise<EventGalleryAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.eventGallery.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { eventId: Number(event_id) },
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.eventGallery.count({
      where: { eventId: Number(event_id) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(id: number): Promise<EventGalleryAdminGetDto | undefined> {
    const event = await this.prisma.eventGallery.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.eventGallery.delete({
      where: { id: Number(id) },
    });
    await this.removeFile('./uploads/events_gallery/' + result.image);

    return 'Event Gallery deleted successfully';
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
        './uploads/events_gallery/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
