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
import { Roles } from 'src/common/decorator/roles.decorator';
import {
  ContentUserGetDto,
  ContentUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidContentIdPipe } from 'src/common/pipes/valid_content_id.pipes';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { ContentUserService } from '../services/content.user.service';
import { ValidContentUuidPipe } from 'src/common/pipes/valid_content_uuid.pipes';

@UseGuards(AccessTokenGuard)
@Controller('content-user')
export class ContentUserController {
  constructor(private contentService: ContentUserService) {}

  @Get('paginate-all')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @GetCurrentUserId() userId: number,
  ): Promise<ContentUserPaginateDto> {
    const result = await this.contentService.findAllPaginate(
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
  ): Promise<ContentUserPaginateDto> {
    const result = await this.contentService.findFreePaginate(
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
  ): Promise<ContentUserPaginateDto> {
    const result = await this.contentService.findPaidPaginate(
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
    @Param('id', ValidContentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<ContentUserGetDto> {
    const result = await this.contentService.findOne(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('generate-payment-order/:id')
  async getContentPaymentOrder(
    @Param('id', ValidContentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.contentService.findOneWithPaymentOrder(
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
    const result = await this.contentService.verifyPaymentRecieved(dto, userId);
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return { status: true, message: 'Payment Successful' };
  }

  @Public()
  @Get('pdf-file/:id')
  async seeUploadedFile(
    @Param('id', ValidContentUuidPipe) file,
    @Res() res: Response,
  ) {
    const result = await this.contentService.findFile(file);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    if (result.type !== 'PDF')
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    res.setHeader('Content-Type', 'application/pdf');
    return res.sendFile(result.file_path, { root: './uploads/pdf' });
  }

  @Get('video-link/:id')
  async getVideoLink(
    @Param('id', ValidContentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<ContentUserGetDto> {
    const result = await this.contentService.findVideoLink(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
