import {
  Controller,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Res,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import {
  EventUserGetDto,
  EventUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { EventUserService } from '../services/event.user.service';
import { ValidEventUrlPipe } from 'src/common/pipes/valid_event_url.pipes';

@UseGuards(AccessTokenGuard)
@Controller('event-user')
export class EventUserController {
  constructor(private eventService: EventUserService) {}

  @Get('paginate-all')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<EventUserPaginateDto> {
    const result = await this.eventService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  async getContent(
    @Param('url', ValidEventUrlPipe) url: string,
  ): Promise<EventUserGetDto> {
    const result = await this.eventService.findOne(url);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('generate-payment-order/:id')
  async getContentPaymentOrder(
    @Param('url', ValidEventUrlPipe) url: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.eventService.findOneWithPaymentOrder(url, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('verify-payment')
  async verifyPayment(
    @Body() dto: PaymentVerifyUserDto,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.eventService.verifyPaymentRecieved(dto, userId);
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return { status: true, message: 'Payment Successful' };
  }

  @Public()
  @Get('banner/:id')
  async seeUploadedFile(
    @Param('id', ValidEventUrlPipe) file,
    @Res() res: Response,
  ) {
    const result = await this.eventService.findFile(file);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    res.setHeader('Content-Type', 'application/pdf');
    return res.sendFile(result.banner, { root: './uploads/events_banner' });
  }
}
