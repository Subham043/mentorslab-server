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
  ExamUserGetDto,
  ExamUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { ExamUserService } from '../services/exam.user.service';
import { ValidExamUuidPipe } from 'src/common/pipes/valid_exam_uuid.pipes';

@UseGuards(AccessTokenGuard)
@Controller('exam-user')
export class ExamUserController {
  constructor(private examService: ExamUserService) {}

  @Get('paginate-all')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @GetCurrentUserId() userId: number,
  ): Promise<ExamUserPaginateDto> {
    const result = await this.examService.findAllPaginate(
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
  ): Promise<ExamUserPaginateDto> {
    const result = await this.examService.findFreePaginate(
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
  ): Promise<ExamUserPaginateDto> {
    const result = await this.examService.findPaidPaginate(
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
    @Param('id', ValidExamUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<ExamUserGetDto> {
    const result = await this.examService.findOne(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('generate-payment-order/:id')
  async getContentPaymentOrder(
    @Param('id', ValidExamUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.examService.findOneWithPaymentOrder(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('verify-payment')
  async verifyPayment(
    @Body() dto: PaymentVerifyUserDto,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.examService.verifyPaymentRecieved(dto, userId);
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return { status: true, message: 'Payment Successful' };
  }

  @Get('appear/:id')
  async requestSession(
    @Param('id', ValidExamUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<string> {
    const result = await this.examService.requestSession(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Public()
  @Get('image/:id')
  async seeUploadedFile(
    @Param('id', ValidExamUuidPipe) file,
    @Res() res: Response,
  ) {
    const result = await this.examService.findFile(file);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return res.sendFile(result.image, {
      root: './uploads/exam_images',
    });
  }
}
