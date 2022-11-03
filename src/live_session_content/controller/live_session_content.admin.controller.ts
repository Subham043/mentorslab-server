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
import {
  LiveSessionContentAdminCreateDto,
  LiveSessionContentAdminGetDto,
  LiveSessionContentAdminPaginateDto,
  LiveSessionContentAdminUpdateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidLiveSessionContentIdPipe } from 'src/common/pipes/valid_live_session_content_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { LiveSessionContentAdminService } from '../services/live_session_content.admin.service';
import {
  getZoomSignature,
  scheduleZoomMeeting,
} from 'src/common/hooks/zoom.hooks';
import { MailService } from 'src/mail/mail.service';

@UseGuards(AccessTokenGuard)
@Controller('live-session-content')
export class LiveSessionContentAdminController {
  constructor(
    private liveSessionContentService: LiveSessionContentAdminService,
    private mailservice: MailService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() contentCreateDto: LiveSessionContentAdminCreateDto,
    @GetCurrentUserId() userId: number,
  ): Promise<LiveSessionContentAdminGetDto> {
    const result = await this.liveSessionContentService.create(
      contentCreateDto,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async updateContent(
    @Param('id', ValidLiveSessionContentIdPipe) id: number,
    @Body() contentUpdateDto: LiveSessionContentAdminUpdateDto,
  ): Promise<LiveSessionContentAdminGetDto> {
    const result = await this.liveSessionContentService.update(
      id,
      contentUpdateDto,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllContent(): Promise<LiveSessionContentAdminGetDto[]> {
    const result = await this.liveSessionContentService.findAll();
    return result;
  }

  @Get('paginate')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<LiveSessionContentAdminPaginateDto> {
    const result = await this.liveSessionContentService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidLiveSessionContentIdPipe) id: number,
  ): Promise<LiveSessionContentAdminGetDto> {
    const result = await this.liveSessionContentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidLiveSessionContentIdPipe) id: number,
  ): Promise<string> {
    const res = await this.liveSessionContentService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/pdf' });
  }

  @Public()
  @Get('zoom/schedule')
  async test() {
    const res = await scheduleZoomMeeting();
    const sign = await getZoomSignature(res.id);
    return sign;
  }

  @Public()
  @Get('mail/send')
  async mail() {
    const res = this.mailservice.sendUserConfirmation();
    return res;
  }
}
