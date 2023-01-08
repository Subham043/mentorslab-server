import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EventInstructorAdminCreateDto,
  EventInstructorAdminGetDto,
  EventInstructorAdminPaginateDto,
  EventInstructorAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';

@Injectable()
export class EventInstructorAdminService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventInstructorAdminCreateDto,
    event_id: number,
  ): Promise<EventInstructorAdminGetDto | undefined> {
    const savedFileName = await this.saveFile(dto.image);

    const {
      name,
      designation,
      description,
      heading,
      facebook,
      instagram,
      linkedin,
      twitter,
    } = dto;
    const event = await this.prisma.eventInstructor.create({
      data: {
        name,
        designation,
        description,
        heading,
        facebook,
        instagram,
        linkedin,
        twitter,
        eventId: event_id,
        image: savedFileName,
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: EventInstructorAdminUpdateDto,
  ): Promise<EventInstructorAdminGetDto | undefined> {
    const res = await this.findOne(id);

    if (dto.image) {
      const savedFileName = await this.saveFile(dto.image);
      await this.removeFile('./uploads/events_instructor/' + res.image);
      await this.prisma.eventInstructor.update({
        where: { id: Number(id) },
        data: {
          image: savedFileName,
        },
      });
    }

    const {
      name,
      designation,
      description,
      heading,
      facebook,
      instagram,
      linkedin,
      twitter,
    } = dto;
    const event = await this.prisma.eventInstructor.update({
      where: { id: Number(id) },
      data: {
        name,
        designation,
        description,
        heading,
        facebook,
        instagram,
        linkedin,
        twitter,
      },
    });
    return event;
  }

  async findAll(event_id: number): Promise<EventInstructorAdminGetDto[]> {
    return await this.prisma.eventInstructor.findMany({
      where: { eventId: Number(event_id) },
    });
  }

  async findAllPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    event_id: number,
  ): Promise<EventInstructorAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.eventInstructor.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { eventId: Number(event_id) },
    });
    const count = await this.prisma.eventInstructor.count({
      where: { eventId: Number(event_id) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(id: number): Promise<EventInstructorAdminGetDto | undefined> {
    const event = await this.prisma.eventInstructor.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.eventInstructor.delete({
      where: { id: Number(id) },
    });
    await this.removeFile('./uploads/events_instructor/' + result.image);

    return 'Event Instructor deleted successfully';
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
        './uploads/events_instructor/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
