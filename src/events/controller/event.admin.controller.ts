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
  EventAdminCreateDto,
  EventAdminGetDto,
  EventAdminPaginateDto,
  EventAdminUpdateDto,
  EventRegistrationAdminPaginateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidEventIdPipe } from 'src/common/pipes/valid_event_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { EventAdminService } from '../services/event.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('event')
export class EventAdminController {
  constructor(private eventService: EventAdminService) {}

  @Post()
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: EventAdminCreateDto,
    @GetCurrentUserId() userId: number,
  ): Promise<EventAdminGetDto> {
    const result = await this.eventService.create(eventCreateDto, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async updateContent(
    @Param('id', ValidEventIdPipe) id: number,
    @Body() eventUpdateDto: EventAdminUpdateDto,
  ): Promise<EventAdminGetDto> {
    const result = await this.eventService.update(id, eventUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllContent(): Promise<EventAdminGetDto[]> {
    const result = await this.eventService.findAll();
    return result;
  }

  @Get('paginate')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<EventAdminPaginateDto> {
    const result = await this.eventService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get('registration')
  @Roles('ADMIN')
  async getAllRegistrationPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<EventRegistrationAdminPaginateDto> {
    const result = await this.eventService.findAllRegistrationPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidEventIdPipe) id: number,
  ): Promise<EventAdminGetDto> {
    const result = await this.eventService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidEventIdPipe) id: number,
  ): Promise<string> {
    const res = await this.eventService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/events_banner' });
  }
}
