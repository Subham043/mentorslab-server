import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EventAdminCreateDto,
  EventAdminGetDto,
  EventAdminPaginateDto,
  EventAdminUpdateDto,
} from '../dto';
import * as fs from 'fs/promises';
import { fileName } from 'src/common/hooks/fileName.hooks';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class EventAdminService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(
    dto: EventAdminCreateDto,
    userId: number,
  ): Promise<EventAdminGetDto | undefined> {
    const savedFileName = await this.saveFile(dto.banner);

    const {
      title,
      video,
      url,
      from_date,
      to_date,
      time,
      draft,
      paid,
      amount,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = dto;
    const event = await this.prisma.event.create({
      data: {
        title,
        video,
        from_date,
        url,
        to_date,
        time,
        draft,
        paid,
        amount,
        facebook,
        instagram,
        twitter,
        linkedin,
        uploadedBy: userId,
        banner: savedFileName,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return event;
  }

  async update(
    id: number,
    dto: EventAdminUpdateDto,
  ): Promise<EventAdminGetDto | undefined> {
    const res = await this.findOne(id);

    if (dto.banner) {
      const savedFileName = await this.saveFile(dto.banner);
      await this.removeFile('./uploads/events_banner/' + res.banner);
      await this.prisma.event.update({
        where: { id: Number(id) },
        data: {
          banner: savedFileName,
        },
      });
    }

    const {
      title,
      video,
      url,
      from_date,
      to_date,
      time,
      draft,
      paid,
      amount,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = dto;
    const event = await this.prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        video,
        url,
        from_date,
        to_date,
        time,
        draft,
        paid,
        amount,
        facebook,
        instagram,
        twitter,
        linkedin,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return event;
  }

  async findAll(): Promise<EventAdminGetDto[]> {
    return await this.prisma.event.findMany({
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
  }): Promise<EventAdminPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.event.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    const count = await this.prisma.event.count({});
    return {
      data,
      count,
    };
  }

  async findOne(id: number): Promise<EventAdminGetDto | undefined> {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
      },
      include: {
        uploadBy: {
          select: this.User,
        },
      },
    });
    return event;
  }

  async remove(id: number): Promise<string> {
    const result = await this.findOne(id);
    await this.prisma.event.delete({
      where: { id: Number(id) },
    });
    await this.removeFile('./uploads/events_banner/' + result.banner);

    return 'Event deleted successfully';
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
        './uploads/events_banner/' + generateFileName,
        file.buffer,
      );
      return generateFileName;
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }
}
