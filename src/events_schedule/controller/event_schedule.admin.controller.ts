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
  EventScheduleAdminCreateDto,
  EventScheduleAdminGetDto,
  EventScheduleAdminPaginateDto,
  EventScheduleAdminUpdateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidEventScheduleIdPipe } from 'src/common/pipes/valid_event_schedule_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { EventScheduleAdminService } from '../services/event_schedule.admin.service';
import { ValidEventIdPipe } from 'src/common/pipes/valid_event_id.pipes';

@UseGuards(AccessTokenGuard)
@Controller('event-schedule')
export class EventScheduleAdminController {
  constructor(private eventService: EventScheduleAdminService) {}

  @Post(':event_id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: EventScheduleAdminCreateDto,
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventScheduleAdminGetDto> {
    const result = await this.eventService.create(eventCreateDto, event_id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async updateContent(
    @Param('id', ValidEventScheduleIdPipe) id: number,
    @Body() eventUpdateDto: EventScheduleAdminUpdateDto,
  ): Promise<EventScheduleAdminGetDto> {
    const result = await this.eventService.update(id, eventUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('all/:event_id')
  @Roles('ADMIN')
  async getAllContent(
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventScheduleAdminGetDto[]> {
    const result = await this.eventService.findAll(event_id);
    return result;
  }

  @Get('paginate/:event_id')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventScheduleAdminPaginateDto> {
    const result = await this.eventService.findAllPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      event_id,
    );
    return result;
  }

  @Get('display/:id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidEventScheduleIdPipe) id: number,
  ): Promise<EventScheduleAdminGetDto> {
    const result = await this.eventService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidEventScheduleIdPipe) id: number,
  ): Promise<string> {
    const res = await this.eventService.remove(id);
    return res;
  }
}
