import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventAdminCreateDto, EventAdminGetDto } from '../dto';

@Injectable()
export class EventCallToActionAdminService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventAdminCreateDto,
    id: number,
  ): Promise<EventAdminGetDto | undefined> {
    const { heading, description } = dto;
    const event = await this.prisma.eventCallToAction.upsert({
      where: { eventId: id },
      update: {
        heading,
        description,
      },
      create: {
        heading,
        description,
        eventId: id,
      },
    });
    return event;
  }

  async findOne(id: number): Promise<EventAdminGetDto | undefined> {
    const event = await this.prisma.eventCallToAction.findFirst({
      where: {
        eventId: id,
      },
    });
    return event;
  }
}
