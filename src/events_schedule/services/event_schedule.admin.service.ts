import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EventScheduleAdminCreateDto,
  EventScheduleAdminGetDto,
  EventScheduleAdminPaginateDto,
  EventScheduleAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';

@Injectable()
export class EventScheduleAdminService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventScheduleAdminCreateDto,
    event_id: number,
  ): Promise<EventScheduleAdminGetDto | undefined> {
    const { title, heading, description } = dto;
    const event = await this.prisma.eventSchedule.create({
      data: {
        title,
        heading,
        description,
        eventId: event_id,
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: EventScheduleAdminUpdateDto,
  ): Promise<EventScheduleAdminGetDto | undefined> {
    const res = await this.findOne(id);

    const { title, heading, description } = dto;
    const event = await this.prisma.eventSchedule.update({
      where: { id: Number(id) },
      data: {
        title,
        heading,
        description,
      },
    });
    return event;
  }

  async findAll(event_id: number): Promise<EventScheduleAdminGetDto[]> {
    return await this.prisma.eventSchedule.findMany({
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
  ): Promise<EventScheduleAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.eventSchedule.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: { eventId: Number(event_id) },
      orderBy: {
        id: 'desc',
      },
    });
    const count = await this.prisma.eventSchedule.count({
      where: { eventId: Number(event_id) },
    });
    return {
      data,
      count,
    };
  }

  async findOne(id: number): Promise<EventScheduleAdminGetDto | undefined> {
    const event = await this.prisma.eventSchedule.findFirst({
      where: {
        id,
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.eventSchedule.delete({
      where: { id: Number(id) },
    });

    return 'Event Schedule deleted successfully';
  }
}
