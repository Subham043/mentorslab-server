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
  AssessmentQuestionAnswerAdminCreateDto,
  AssessmentQuestionAnswerAdminGetDto,
  AssessmentQuestionAnswerAdminPaginateDto,
  AssessmentQuestionAnswerAdminUpdateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidAssessmentQuestionAnswerIdPipe } from 'src/common/pipes/valid_assessment_question_answer_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { AssessmentQuestionAnswerAdminService } from '../services/assessment_question_answer.admin.service';
import { ValidAssessmentIdPipe } from 'src/common/pipes/valid_assessment_id.pipes';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';

@UseGuards(AccessTokenGuard)
@Controller('question-answer')
export class AssessmentQuestionAnswerAdminController {
  constructor(private eventService: AssessmentQuestionAnswerAdminService) {}

  @Post(':assessment_id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: AssessmentQuestionAnswerAdminCreateDto,
    @Param('assessment_id', ValidAssessmentIdPipe) assessment_id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssessmentQuestionAnswerAdminGetDto> {
    const result = await this.eventService.create(
      eventCreateDto,
      assessment_id,
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
    @Param('id', ValidAssessmentQuestionAnswerIdPipe) id: number,
    @Body() eventUpdateDto: AssessmentQuestionAnswerAdminUpdateDto,
  ): Promise<AssessmentQuestionAnswerAdminGetDto> {
    const result = await this.eventService.update(id, eventUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('all/:assessment_id')
  @Roles('ADMIN')
  async getAllContent(
    @Param('assessment_id', ValidAssessmentIdPipe) assessment_id: number,
  ): Promise<AssessmentQuestionAnswerAdminGetDto[]> {
    const result = await this.eventService.findAll(assessment_id);
    return result;
  }

  @Get('paginate/:assessment_id')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('assessment_id', ValidAssessmentIdPipe) assessment_id: number,
  ): Promise<AssessmentQuestionAnswerAdminPaginateDto> {
    const result = await this.eventService.findAllPaginate(
      {
        skip: Number(skip),
        take: Number(take),
      },
      assessment_id,
    );
    return result;
  }

  @Get('display/:id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidAssessmentQuestionAnswerIdPipe) id: number,
  ): Promise<AssessmentQuestionAnswerAdminGetDto> {
    const result = await this.eventService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidAssessmentQuestionAnswerIdPipe) id: number,
  ): Promise<string> {
    const res = await this.eventService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, {
      root: './uploads/assessment_question_answer',
    });
  }
}
