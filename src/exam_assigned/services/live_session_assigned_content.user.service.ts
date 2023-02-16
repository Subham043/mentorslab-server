import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleDto } from '../dto';
import {
  getZoomSignature,
  scheduleZoomMeeting,
} from 'src/common/hooks/zoom.hooks';

@Injectable()
export class LiveSessionAssignedContentUserService {
  constructor(private prisma: PrismaService) {}

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
      const sign = await getZoomSignature(data.zoom['id']);
      return sign;
    }
    throw new HttpException('No signature available', HttpStatus.BAD_REQUEST);
  }
}
