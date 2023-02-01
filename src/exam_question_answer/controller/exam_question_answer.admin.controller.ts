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
  ExamQuestionAnswerAdminCreateDto,
  ExamQuestionAnswerAdminGetDto,
  ExamQuestionAnswerAdminPaginateDto,
  ExamQuestionAnswerAdminUpdateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidExamQuestionAnswerIdPipe } from 'src/common/pipes/valid_exam_question_answer_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { ExamQuestionAnswerAdminService } from '../services/exam_question_answer.admin.service';
import { ValidExamIdPipe } from 'src/common/pipes/valid_exam_id.pipes';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';

@UseGuards(AccessTokenGuard)
@Controller('question-answer')
export class ExamQuestionAnswerAdminController {
  constructor(private eventService: ExamQuestionAnswerAdminService) {}

  @Post(':exam_id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: ExamQuestionAnswerAdminCreateDto,
    @Param('exam_id', ValidExamIdPipe) exam_id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<ExamQuestionAnswerAdminGetDto> {
    const result = await this.eventService.create(
      eventCreateDto,
      exam_id,
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
    @Param('id', ValidExamQuestionAnswerIdPipe) id: number,
    @Body() eventUpdateDto: ExamQuestionAnswerAdminUpdateDto,
  ): Promise<ExamQuestionAnswerAdminGetDto> {
    const result = await this.eventService.update(id, eventUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('all/:exam_id')
  @Roles('ADMIN')
  async getAllContent(
    @Param('exam_id', ValidExamIdPipe) exam_id: number,
  ): Promise<ExamQuestionAnswerAdminGetDto[]> {
    const result = await this.eventService.findAll(exam_id);
    return result;
  }

  @Get('paginate/:exam_id')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('exam_id', ValidExamIdPipe) exam_id: number,
  ): Promise<ExamQuestionAnswerAdminPaginateDto> {
    const result = await this.eventService.findAllPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      exam_id,
    );
    return result;
  }

  @Get('display/:id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidExamQuestionAnswerIdPipe) id: number,
  ): Promise<ExamQuestionAnswerAdminGetDto> {
    const result = await this.eventService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidExamQuestionAnswerIdPipe) id: number,
  ): Promise<string> {
    const res = await this.eventService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/exam_question_answer' });
  }
}
