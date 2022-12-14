import { Injectable } from '@nestjs/common';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventAdminCreateDto, EventAdminGetDto } from '../dto';
import * as fs from 'fs/promises';

@Injectable()
export class EventAboutAdminService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventAdminCreateDto,
    id: number,
  ): Promise<EventAdminGetDto | undefined> {
    const { heading, description } = dto;
    const data = { heading, description };
    const eventResult = await this.findOne(id);
    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      if (eventResult) {
        await this.removeFile('./uploads/events_about/' + eventResult.image);
      }
      data['image'] = savedFileName;
    }
    const event = await this.prisma.eventAbout.upsert({
      where: { eventId: id },
      update: {
        ...data,
      },
      create: {
        ...data,
        eventId: id,
      },
    });
    return event;
  }

  async findOne(id: number): Promise<EventAdminGetDto | undefined> {
    const event = await this.prisma.eventAbout.findFirst({
      where: {
        eventId: id,
      },
    });
    return event;
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
        './uploads/events_about/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
