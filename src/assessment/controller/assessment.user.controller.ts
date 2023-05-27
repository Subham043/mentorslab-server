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
  AssessmentUserGetDto,
  AssessmentUserPaginateDto,
  PaymentVerifyUserDto,
  AssessmentAnswerUserModifyDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { AssessmentUserService } from '../services/assessment.user.service';
import { ValidAssessmentUuidPipe } from 'src/common/pipes/valid_assessment_uuid.pipes';
import { ValidAssessmentQuestionAnswerUuidPipe } from 'src/common/pipes/valid_assessment_question_answer_uuid.pipes';

@UseGuards(AccessTokenGuard)
@Controller('assessment-user')
export class AssessmentUserController {
  constructor(private assessmentService: AssessmentUserService) {}

  @Get('paginate-all')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @GetCurrentUserId() userId: number,
  ): Promise<AssessmentUserPaginateDto> {
    const result = await this.assessmentService.findAllPaginate(
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
  ): Promise<AssessmentUserPaginateDto> {
    const result = await this.assessmentService.findFreePaginate(
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
  ): Promise<AssessmentUserPaginateDto> {
    const result = await this.assessmentService.findPaidPaginate(
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
    @Param('id', ValidAssessmentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<AssessmentUserGetDto> {
    const result = await this.assessmentService.findOne(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('generate-payment-order/:id')
  async getContentPaymentOrder(
    @Param('id', ValidAssessmentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.assessmentService.findOneWithPaymentOrder(
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
    const result = await this.assessmentService.verifyPaymentRecieved(
      dto,
      userId,
    );
    if (!result)
      throw new HttpException('Payment Unsuccessful', HttpStatus.NOT_FOUND);
    return { status: true, message: 'Payment Successful' };
  }

  @Get('appear/:id')
  async requestSession(
    @Param('id', ValidAssessmentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<string> {
    const result = await this.assessmentService.requestSession(id, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('sets/:id')
  async getAssessmentQuestion(
    @Param('id', ValidAssessmentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.assessmentService.getAssessmentQuestion(
      id,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('answer/:id')
  async postAssessmentQuestionAnswer(
    @Param('id', ValidAssessmentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
    @Body() answer: AssessmentAnswerUserModifyDto,
  ): Promise<any> {
    const result = await this.assessmentService.postAssessmentQuestionAnswer(
      id,
      userId,
      answer,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('report/:id')
  async getAssessmentReportPagination(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('id', ValidAssessmentUuidPipe) id: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    const result = await this.assessmentService.getAssessmentReport(
      {
        skip: Number(skip),
        take: Number(take),
      },
      id,
      userId,
    );
    return result;
  }

  @Public()
  @Get('image/:id')
  async seeUploadedFile(
    @Param('id', ValidAssessmentUuidPipe) file,
    @Res() res: Response,
  ) {
    const result = await this.assessmentService.findFile(file);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return res.sendFile(result.image, {
      root: './uploads/assessment_images',
    });
  }

  @Public()
  @Get('question-answer-image/:id')
  async seeUploadedQuestionFile(@Param('id') file, @Res() res: Response) {
    return res.sendFile(file, {
      root: './uploads/assessment_question_answer',
    });
  }
}
