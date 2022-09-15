import { Controller, UseGuards, Post, Body, HttpException, HttpStatus, Get, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ContentService } from './content.service';
import { ContentCreateDto, ContentGetDto, ContentUpdateDto } from './dto';

@UseGuards(AccessTokenGuard)
@Controller('content')
export class ContentController {
    constructor(private contentService: ContentService) { }

    @Post()
    // @Roles('ADMIN')
    async createContent(@Body() contentCreateDto: ContentCreateDto, @GetCurrentUserId() userId: number): Promise<ContentGetDto> {
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
        if (!res)
            throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
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
    async getContent(@Param('id', ParseIntPipe) id: number): Promise<ContentGetDto> {
        const result = await this.contentService.findOne(id);
        if (!result)
            throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
        return result;
    }
    
    @Delete(':id')
    //   @Roles('ADMIN')
    async deleteContent(@Param('id', ParseIntPipe) id: number): Promise<String> {
        const result = await this.contentService.findOne(id);
        if (!result)
            throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
        const res = await this.contentService.remove(id);
        return res;
    }
}
