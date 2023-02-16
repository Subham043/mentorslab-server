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
import { LiveSessionAssignedContentUserService } from '../services/live_session_assigned_content.user.service';
import { MailService } from 'src/mail/mail.service';
import { ScheduleDto } from '../dto';

@UseGuards(AccessTokenGuard)
@Controller('live-session-assigned-content-user')
export class LiveSessionAssignedContentUserController {
  constructor(
    private liveSessionAssignedContentService: LiveSessionAssignedContentUserService,
    private mailservice: MailService,
  ) {}

  @Get('zoom-signature/:id')
  async zoomSignature(
    @Param('id', ValidLiveSessionAssignedContentIdPipe) id: number,
  ): Promise<any> {
    const result = await this.liveSessionAssignedContentService.zoomSignature(
      id,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
