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
  EventInstructorAdminCreateDto,
  EventInstructorAdminGetDto,
  EventInstructorAdminPaginateDto,
  EventInstructorAdminUpdateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidEventInstructorIdPipe } from 'src/common/pipes/valid_event_instructor_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { EventInstructorAdminService } from '../services/event_instructor.admin.service';
import { ValidEventIdPipe } from 'src/common/pipes/valid_event_id.pipes';

@UseGuards(AccessTokenGuard)
@Controller('event-instructor')
export class EventInstructorAdminController {
  constructor(private eventService: EventInstructorAdminService) {}

  @Post(':event_id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: EventInstructorAdminCreateDto,
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventInstructorAdminGetDto> {
    const result = await this.eventService.create(eventCreateDto, event_id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async updateContent(
    @Param('id', ValidEventInstructorIdPipe) id: number,
    @Body() eventUpdateDto: EventInstructorAdminUpdateDto,
  ): Promise<EventInstructorAdminGetDto> {
    const result = await this.eventService.update(id, eventUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('all/:event_id')
  @Roles('ADMIN')
  async getAllContent(
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventInstructorAdminGetDto[]> {
    const result = await this.eventService.findAll(event_id);
    return result;
  }

  @Get('paginate/:event_id')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('event_id', ValidEventIdPipe) event_id: number,
  ): Promise<EventInstructorAdminPaginateDto> {
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
    @Param('id', ValidEventInstructorIdPipe) id: number,
  ): Promise<EventInstructorAdminGetDto> {
    const result = await this.eventService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidEventInstructorIdPipe) id: number,
  ): Promise<string> {
    const res = await this.eventService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/events_testimonial' });
  }
}
