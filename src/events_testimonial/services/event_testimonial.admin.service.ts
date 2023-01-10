import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EventTestimonialAdminCreateDto,
  EventTestimonialAdminGetDto,
  EventTestimonialAdminPaginateDto,
  EventTestimonialAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';

@Injectable()
export class EventTestimonialAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventTestimonialAdminCreateDto,
    event_id: number,
  ): Promise<EventTestimonialAdminGetDto | undefined> {
    const savedFileName = await this.saveFile(dto.image);

    const { name, designation, message } = dto;
    const event = await this.prisma.eventTestimonial.create({
      data: {
        name,
        designation,
        message,
        eventId: event_id,
        image: savedFileName,
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: EventTestimonialAdminUpdateDto,
  ): Promise<EventTestimonialAdminGetDto | undefined> {
    const res = await this.findOne(id);

    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      await this.removeFile('./uploads/events_testimonial/' + res.image);
      await this.prisma.eventTestimonial.update({
        where: { id: Number(id) },
        data: {
          image: savedFileName,
        },
      });
    }

    const { name, designation, message } = dto;
    const event = await this.prisma.eventTestimonial.update({
      where: { id: Number(id) },
      data: {
        name,
        designation,
        message,
      },
    });
    return event;
  }

  async findAll(event_id: number): Promise<EventTestimonialAdminGetDto[]> {
    return await this.prisma.eventTestimonial.findMany({
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
  ): Promise<EventTestimonialAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.eventTestimonial.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { eventId: Number(event_id) },
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.eventTestimonial.count({
      where: { eventId: Number(event_id) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(id: number): Promise<EventTestimonialAdminGetDto | undefined> {
    const event = await this.prisma.eventTestimonial.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.eventTestimonial.delete({
      where: { id: Number(id) },
    });
    await this.removeFile('./uploads/events_testimonial/' + result.image);

    return 'Event Testimonial deleted successfully';
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
        './uploads/events_testimonial/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
