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
import { Roles } from 'src/common/decorator/roles.decorator';
import {
  EventGalleryAdminCreateDto,
  EventGalleryAdminGetDto,
  EventGalleryAdminPaginateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidEventGalleryIdPipe } from 'src/common/pipes/valid_event_gallery_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { EventGalleryAdminService } from '../services/event_gallery.admin.service';
import { ValidEventIdPipe } from 'src/common/pipes/valid_event_id.pipes';

@UseGuards(AccessTokenGuard)
@Controller('event-gallery')
export class EventGalleryAdminController {
  constructor(private eventService: EventGalleryAdminService) {}

  @Post(':event_id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: EventGalleryAdminCreateDto,
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventGalleryAdminGetDto> {
    const result = await this.eventService.create(eventCreateDto, event_id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('all/:event_id')
  @Roles('ADMIN')
  async getAllContent(
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventGalleryAdminGetDto[]> {
    const result = await this.eventService.findAll(event_id);
    return result;
  }

  @Get('paginate/:event_id')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventGalleryAdminPaginateDto> {
    const result = await this.eventService.findAllPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      event_id,
    );
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidEventGalleryIdPipe) id: number,
  ): Promise<string> {
    const res = await this.eventService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/events_gallery' });
  }
}
