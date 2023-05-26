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
  Query,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import {
  AssessmentCategoryAdminCreateDto,
  AssessmentCategoryAdminGetDto,
  AssessmentCategoryAdminPaginateDto,
  AssessmentCategoryAdminUpdateDto,
} from '../dto';
import { ValidAssessmentCategoryIdPipe } from 'src/common/pipes/valid_assessment_category_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { AssessmentCategoryAdminService } from '../services/assessment_category.admin.service';
import { ValidAssessmentIdPipe } from 'src/common/pipes/valid_assessment_id.pipes';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';

@UseGuards(AccessTokenGuard)
@Controller('assessment-category')
export class AssessmentCategoryAdminController {
  constructor(
    private assessmentCategoryService: AssessmentCategoryAdminService,
  ) {}

  @Post(':assessment_id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: AssessmentCategoryAdminCreateDto,
    @Param('assessment_id', ValidAssessmentIdPipe) assessment_id: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssessmentCategoryAdminGetDto> {
    const result = await this.assessmentCategoryService.create(
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
    @Param('id', ValidAssessmentCategoryIdPipe) id: number,
    @Body() eventUpdateDto: AssessmentCategoryAdminUpdateDto,
  ): Promise<AssessmentCategoryAdminGetDto> {
    const result = await this.assessmentCategoryService.update(
      id,
      eventUpdateDto,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('all/:assessment_id')
  @Roles('ADMIN')
  async getAllContent(
    @Param('assessment_id', ValidAssessmentIdPipe) assessment_id: number,
  ): Promise<AssessmentCategoryAdminGetDto[]> {
    const result = await this.assessmentCategoryService.findAll(assessment_id);
    return result;
  }

  @Get('paginate/:assessment_id')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
    @Param('assessment_id', ValidAssessmentIdPipe) assessment_id: number,
  ): Promise<AssessmentCategoryAdminPaginateDto> {
    const result = await this.assessmentCategoryService.findAllPaginate(
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
    @Param('id', ValidAssessmentCategoryIdPipe) id: number,
  ): Promise<AssessmentCategoryAdminGetDto> {
    const result = await this.assessmentCategoryService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidAssessmentCategoryIdPipe) id: number,
  ): Promise<string> {
    const res = await this.assessmentCategoryService.remove(id);
    return res;
  }
}
