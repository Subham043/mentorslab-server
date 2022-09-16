import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AssignedContentService } from './assigned_content.service';
import {
  AssignedContentCreateDto,
  AssignedContentCreateArrayDto,
  AssignedContentGetDto,
} from './dto';

@UseGuards(AccessTokenGuard)
@Controller('assigned-content')
export class AssignedContentController {
  constructor(private assignedContentService: AssignedContentService) {}

  @Post()
  @Roles('ADMIN')
  async createAssignedContent(
    @Body() dto: AssignedContentCreateDto,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetDto> {
    const result = await this.assignedContentService.create(dto, userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('multiple')
  @Roles('ADMIN')
  async createAssignedContentMultiple(
    @Body() dto: AssignedContentCreateArrayDto,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetDto[]> {
    const result = await this.assignedContentService.createMultiple(
      dto,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get()
  @Roles('ADMIN')
  async getAllContent(): Promise<AssignedContentGetDto[]> {
    const result = await this.assignedContentService.findAll();
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AssignedContentGetDto> {
    const result = await this.assignedContentService.findOne(id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteContent(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const result = await this.assignedContentService.findOne(id);
    if (!result) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }
    const res = await this.assignedContentService.remove(id);
    return res;
  }
}
