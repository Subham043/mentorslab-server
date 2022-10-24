import {
  Controller,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ContentUserGetDto, ContentUserPaginateDto } from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidContentIdPipe } from 'src/common/pipes/valid_content_id.pipes';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { ContentUserService } from '../services/content.user.service';

@UseGuards(AccessTokenGuard)
@Controller('content-user')
export class ContentUserController {
  constructor(private contentService: ContentUserService) {}

  @Get('paginate-all')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<ContentUserPaginateDto> {
    const result = await this.contentService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get('paginate-free')
  @Roles('ADMIN')
  async getFreeContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<ContentUserPaginateDto> {
    const result = await this.contentService.findFreePaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get('paginate-paid')
  @Roles('ADMIN')
  async getPaidContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<ContentUserPaginateDto> {
    const result = await this.contentService.findPaidPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidContentIdPipe) id: number,
  ): Promise<ContentUserGetDto> {
    const result = await this.contentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/pdf' });
  }
}
