import {
  Controller,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Put,
  Delete,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ValidLiveSessionAssignedContentIdPipe } from 'src/common/pipes/valid_live_session_assigned_content_id.pipes';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { LiveSessionAssignedContentAdminService } from '../services/live_session_assigned_content.admin.service';
import { MailService } from 'src/mail/mail.service';
import { ScheduleDto } from '../dto';

@UseGuards(AccessTokenGuard)
@Controller('live-session-assigned-content')
export class LiveSessionAssignedContentAdminController {
  constructor(
    private liveSessionAssignedContentService: LiveSessionAssignedContentAdminService,
    private mailservice: MailService,
  ) {}

  @Post('schedule/:id')
  @Roles('ADMIN')
  async scheduleSession(
    @Param('id', ValidLiveSessionAssignedContentIdPipe) id: number,
    @Body() scheduleDto: ScheduleDto,
  ): Promise<any> {
    const result = await this.liveSessionAssignedContentService.scheduleSession(
      id,
      scheduleDto,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('re-schedule/:id')
  @Roles('ADMIN')
  async rescheduleSession(
    @Param('id', ValidLiveSessionAssignedContentIdPipe) id: number,
    @Body() scheduleDto: ScheduleDto,
  ): Promise<any> {
    const result =
      await this.liveSessionAssignedContentService.rescheduleSession(
        id,
        scheduleDto,
      );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('paginate')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<any> {
    const result = await this.liveSessionAssignedContentService.findAllPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
    );
    return result;
  }
}
