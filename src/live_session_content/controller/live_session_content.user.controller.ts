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
  LiveSessionContentUserGetDto,
  LiveSessionContentUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { LiveSessionContentUserService } from '../services/live_session_content.user.service';
import { ValidLiveSessionContentUuidPipe } from 'src/common/pipes/valid_live_session_content_uuid.pipes';

@UseGuards(AccessTokenGuard)
@Controller('live-session-content-user')
export class LiveSessionContentUserController {
  constructor(
    private liveSessionContentService: LiveSessionContentUserService,
  ) {}

  @Get('paginate-all')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @GetCurrentUserId() userId: number,
  ): Promise<LiveSessionContentUserPaginateDto> {
    const result = await this.liveSessionContentService.findAllPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      userId,
    );
    return result;
  }

  @Get('paginate-free')
  async getFreeContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @GetCurrentUserId() userId: number,
  ): Promise<LiveSessionContentUserPaginateDto> {
    const result = await this.liveSessionContentService.findFreePaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      userId,
    );
    return result;
  }

  @Get('paginate-paid')
  async getPaidContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @GetCurrentUserId() userId: number,
  ): Promise<LiveSessionContentUserPaginateDto> {
    const result = await this.liveSessionContentService.findPaidPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      userId,
    );
    return result;
  }

  @Get(':id')
  async getContent(
    @Param('id', ValidLiveSessionContentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<LiveSessionContentUserGetDto> {
    const result = await this.liveSessionContentService.findOne(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('generate-payment-order/:id')
  async getContentPaymentOrder(
    @Param('id', ValidLiveSessionContentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.liveSessionContentService.findOneWithPaymentOrder(
      id,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('verify-payment')
  async verifyPayment(
    @Body() dto: PaymentVerifyUserDto,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.liveSessionContentService.verifyPaymentRecieved(
      dto,
      userId,
    );
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return { status: true, message: 'Payment Successful' };
  }

  @Public()
  @Get('image/:id')
  async seeUploadedFile(
    @Param('id', ValidLiveSessionContentUuidPipe) file,
    @Res() res: Response,
  ) {
    const result = await this.liveSessionContentService.findFile(file);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return res.sendFile(result.image, {
      root: './uploads/live_session_content_images',
    });
  }
}
