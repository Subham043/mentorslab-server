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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  Res,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ContentService } from './content.service';
import { ContentCreateDto, ContentGetDto, ContentUpdateDto } from './dto';
import { Express, Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName } from 'src/common/file/image_name.interceptor';
import { imageFileFilter } from 'src/common/file/image.validation';
import { diskStorage } from 'multer';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(AccessTokenGuard)
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post()
  // @Roles('ADMIN')
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
  //   @Roles('ADMIN')
  async updateContent(
    @Param('id', ParseIntPipe) id: number,
    @Body() contentUpdateDto: ContentUpdateDto,
  ): Promise<ContentGetDto> {
    const res = await this.contentService.findOne(id);
    if (!res) throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    const result = await this.contentService.update(id, contentUpdateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  //   @Roles('ADMIN')
  async getAllContent(): Promise<ContentGetDto[]> {
    const result = await this.contentService.findAll();
    return result;
  }

  @Get(':id')
  //   @Roles('ADMIN')
  async getContent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContentGetDto> {
    const result = await this.contentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  //   @Roles('ADMIN')
  async deleteContent(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const result = await this.contentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    const res = await this.contentService.remove(id);
    return res;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(
    @Req() req: Request,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (!req)
      throw new HttpException(
        'Please fill in the required fields',
        HttpStatus.BAD_REQUEST,
      );
    console.log(file);
    return 'test';
  }

  @Public()
  @Get('view/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile('logo-4fefd8feb67311b6.jpg', { root: './uploads' });
  }
}
