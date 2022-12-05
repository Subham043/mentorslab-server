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
  ExamAdminCreateDto,
  ExamAdminGetDto,
  ExamAdminPaginateDto,
  ExamAdminUpdateDto,
  ExamUserGetDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidExamIdPipe } from 'src/common/pipes/valid_exam_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { ExamAdminService } from '../services/exam.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('exam')
export class ExamAdminController {
  constructor(private examService: ExamAdminService) {}

  @Post()
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() contentCreateDto: ExamAdminCreateDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ExamAdminGetDto> {
    const result = await this.examService.create(contentCreateDto, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async updateContent(
    @Param('id', ValidExamIdPipe) id: number,
    @Body() contentUpdateDto: ExamAdminUpdateDto,
  ): Promise<ExamAdminGetDto> {
    const result = await this.examService.update(id, contentUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllContent(): Promise<ExamAdminGetDto[]> {
    const result = await this.examService.findAll();
    return result;
  }

  @Get('paginate')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<ExamAdminPaginateDto> {
    const result = await this.examService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidExamIdPipe) id: number,
  ): Promise<ExamAdminGetDto> {
    const result = await this.examService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidExamIdPipe) id: number,
  ): Promise<string> {
    const res = await this.examService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/pdf' });
  }
}
