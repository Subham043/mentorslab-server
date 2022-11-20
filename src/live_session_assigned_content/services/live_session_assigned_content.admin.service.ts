import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleDto } from '../dto';
import {
  getZoomSignature,
  getZoomSignatureAdmin,
  scheduleZoomMeeting,
} from 'src/common/hooks/zoom.hooks';

@Injectable()
export class LiveSessionAssignedContentAdminService {
  constructor(private prisma: PrismaService) {}

  async findAllPaginate(params: {
    skip?: number;
    take?: number;
  }): Promise<any> {
    const { skip, take } = params;
    const data = await this.prisma.liveSessionContentAssigned.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        scheduledAt: true,
        scheduledOn: true,
        assignedRole: true,
        status: true,
        liveSessionContent: {
          select: {
            id: true,
            uuid: true,
            name: true,
            heading: true,
          },
        },
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    const count = await this.prisma.liveSessionContentAssigned.count({});
    return {
      data,
      count,
    };
  }

  async scheduleSession(id: number, scheduleDto: ScheduleDto): Promise<any> {
    const data = await this.prisma.liveSessionContentAssigned.findFirst({
      where: {
        id,
        status: 'USER_REQUESTED',
      },
      select: {
        liveSessionContent: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!data) throw new HttpException('No data found', HttpStatus.BAD_REQUEST);
    const zoom = await scheduleZoomMeeting(
      data.liveSessionContent.name,
      String(scheduleDto.datetime),
    );
    const result = await this.prisma.liveSessionContentAssigned.update({
      where: {
        id,
      },
      data: {
        status: 'SCHEDULED',
        scheduledOn: scheduleDto.datetime,
        zoom,
      },
    });
    return result;
  }

  async rescheduleSession(id: number, scheduleDto: ScheduleDto): Promise<any> {
    const data = await this.prisma.liveSessionContentAssigned.findFirst({
      where: {
        OR: [
          {
            id,
            status: 'SCHEDULED',
          },
          {
            id,
            status: 'RESCHEDULED',
          },
        ],
      },
      select: {
        liveSessionContent: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!data) throw new HttpException('No data found', HttpStatus.BAD_REQUEST);
    const zoom = await scheduleZoomMeeting(
      data.liveSessionContent.name,
      String(scheduleDto.datetime),
    );
    const result = await this.prisma.liveSessionContentAssigned.update({
      where: {
        id,
      },
      data: {
        status: 'RESCHEDULED',
        scheduledOn: scheduleDto.datetime,
        zoom,
      },
    });
    return result;
  }

  async zoomSignature(id: number): Promise<any> {
    const data = await this.prisma.liveSessionContentAssigned.findFirst({
      where: {
        id,
        OR: [
          {
            status: 'SCHEDULED',
          },
          {
            status: 'RESCHEDULED',
          },
        ],
      },
      select: {
        zoom: true,
        liveSessionContent: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!data) throw new HttpException('No data found', HttpStatus.BAD_REQUEST);
    if (data.zoom['id']) {
      const sign = await getZoomSignatureAdmin(data.zoom['id']);
      return sign;
    }
    throw new HttpException('No signature available', HttpStatus.BAD_REQUEST);
  }
}
