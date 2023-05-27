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
  AssessmentAdminCreateDto,
  AssessmentAdminGetDto,
  AssessmentAdminPaginateDto,
  AssessmentAdminUpdateDto,
} from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidAssessmentIdPipe } from 'src/common/pipes/valid_assessment_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { AssessmentAdminService } from '../services/assessment.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('assessment')
export class AssessmentAdminController {
  constructor(private assessmentService: AssessmentAdminService) {}

  @Post()
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() contentCreateDto: AssessmentAdminCreateDto,
    @GetCurrentUserId() userId: number,
  ): Promise<AssessmentAdminGetDto> {
    const result = await this.assessmentService.create(
      contentCreateDto,
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
    @Param('id', ValidAssessmentIdPipe) id: number,
    @Body() contentUpdateDto: AssessmentAdminUpdateDto,
  ): Promise<AssessmentAdminGetDto> {
    const result = await this.assessmentService.update(id, contentUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllContent(): Promise<AssessmentAdminGetDto[]> {
    const result = await this.assessmentService.findAll();
    return result;
  }

  @Get('paginate')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<AssessmentAdminPaginateDto> {
    const result = await this.assessmentService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidAssessmentIdPipe) id: number,
  ): Promise<AssessmentAdminGetDto> {
    const result = await this.assessmentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidAssessmentIdPipe) id: number,
  ): Promise<string> {
    const res = await this.assessmentService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/assessment_images' });
  }
}
