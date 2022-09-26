import {
  Controller,
  UseGuards,
  UploadedFile,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Patch,
  Delete,
  Param,
  Res,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ContentService } from './content.service';
import { ContentCreateDto, ContentGetDto, ContentUpdateDto } from './dto';
import { Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidContentIdPipe } from 'src/common/pipes/valid_content_id.pipes';
import { FormDataRequest } from 'nestjs-form-data';

@UseGuards(AccessTokenGuard)
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post()
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() contentCreateDto: ContentCreateDto,
    @GetCurrentUserId() userId: number,
  ): Promise<ContentGetDto> {

    const result = await this.contentService.create(contentCreateDto, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Patch(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async updateContent(
    @Param('id', ValidContentIdPipe) id: number,
    @Body() contentUpdateDto: ContentUpdateDto,
  ): Promise<ContentGetDto> {
    const result = await this.contentService.update(id, contentUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllContent(): Promise<ContentGetDto[]> {
    const result = await this.contentService.findAll();
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidContentIdPipe) id: number,
  ): Promise<ContentGetDto> {
    const result = await this.contentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(
    @Param('id', ValidContentIdPipe) id: number,
  ): Promise<string> {
    const result = await this.contentService.findOne(id);
    if (!result) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    } else if (result.type === 'PDF') {
      await this.contentService.removeFile('./uploads/pdf/' + result.file_path);
    }
    const res = await this.contentService.remove(id);
    return res;
  }

  @Public()
  @Get('file/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/pdf' });
  }

}
