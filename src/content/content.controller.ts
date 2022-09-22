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
  ParseIntPipe,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ContentService } from './content.service';
import { ContentCreateDto, ContentGetDto, ContentUpdateDto } from './dto';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName } from 'src/common/file/image_name.interceptor';
import { imageFileFilter } from 'src/common/file/image.validation';
import { diskStorage } from 'multer';
import { Public } from 'src/common/decorator/public.decorator';
import { ValidContentIdPipe } from 'src/common/pipes/valid_content_id.pipes';

@UseGuards(AccessTokenGuard)
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post()
  // @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/pdf',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
    ValidContentIdPipe,
  )
  async createContent(
    @Body() contentCreateDto: ContentCreateDto,
    @GetCurrentUserId() userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ContentGetDto> {
    if (contentCreateDto.type === 'PDF' && !file) {
      throw new HttpException('PDF File is required', HttpStatus.BAD_REQUEST);
    } else if (contentCreateDto.type === 'PDF' && file) {
      contentCreateDto.file_path = file.filename;
    } else if (contentCreateDto.type !== 'PDF' && file) {
      await this.contentService.removeFile(file.path);
      throw new HttpException(
        'File cannot be attached to this request',
        HttpStatus.BAD_REQUEST,
      );
    } else if (contentCreateDto.type !== 'PDF' && !contentCreateDto.file_path) {
      throw new HttpException('Video link is required', HttpStatus.BAD_REQUEST);
    }

    const result = await this.contentService.create(contentCreateDto, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/pdf',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Roles('ADMIN')
  async updateContent(
    @Param('id', ValidContentIdPipe) id: number,
    @Body() contentUpdateDto: ContentUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ContentGetDto> {
    const res = await this.contentService.findOne(id);
    if (!res) throw new HttpException('Data not found', HttpStatus.NOT_FOUND);

    if (contentUpdateDto.type === 'PDF' && res.type !== 'PDF' && !file) {
      throw new HttpException('PDF File is required', HttpStatus.BAD_REQUEST);
    } else if (contentUpdateDto.type === 'PDF' && res.type !== 'PDF' && file) {
      contentUpdateDto.file_path = file.filename;
      await this.contentService.removeFile('./uploads/pdf/' + res.file_path);
    } else if (res.type === 'PDF' && file) {
      contentUpdateDto.file_path = file.filename;
      await this.contentService.removeFile('./uploads/pdf/' + res.file_path);
    }

    if (contentUpdateDto.type !== 'PDF' && file) {
      await this.contentService.removeFile(file.path);
      throw new HttpException(
        'File cannot be attached to this request',
        HttpStatus.BAD_REQUEST,
      );
    } else if (
      contentUpdateDto.type !== 'PDF' &&
      res.type === 'PDF' &&
      !contentUpdateDto.file_path
    ) {
      throw new HttpException('Video link is required', HttpStatus.BAD_REQUEST);
    }

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
  // @Roles('ADMIN')
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
