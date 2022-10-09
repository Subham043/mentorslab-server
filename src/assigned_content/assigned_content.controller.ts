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
import { ValidContentIdPipe } from 'src/common/pipes/valid_content_id.pipes';
import { ValidUserIdPipe } from 'src/common/pipes/valid_user_id.pipes';
import { AssignedContentService } from './assigned_content.service';
import {
  AssignedContentGetDto,
  AssignedContentToUserCreateArrayDto,
  AssignedContentToUserCreateDto,
  AssignedUserToContentCreateArrayDto,
  AssignedUserToContentCreateDto,
} from './dto';

@UseGuards(AccessTokenGuard)
@Controller('assign')
export class AssignedContentController {
  constructor(private assignedContentService: AssignedContentService) {}

  @Post('content-to-user/:contentId')
  @Roles('ADMIN')
  async createAssignedContentToUser(
    @Body() dto: AssignedContentToUserCreateDto,
    @Param('contentId', ValidContentIdPipe) contentId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetDto> {
    const result = await this.assignedContentService.createViaContent(
      dto,
      contentId,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('content-to-user-multiple/:contentId')
  @Roles('ADMIN')
  async createAssignedContentToUserMultiple(
    @Body() dto: AssignedContentToUserCreateArrayDto,
    @Param('contentId', ValidContentIdPipe) contentId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetDto[]> {
    const result = await this.assignedContentService.createViaContentMultiple(
      dto,
      contentId,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('user-to-content/:assignedToId')
  @Roles('ADMIN')
  async createAssignedUserToContent(
    @Body() dto: AssignedUserToContentCreateDto,
    @Param('assignedToId', ValidUserIdPipe) assignedToId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetDto> {
    const result = await this.assignedContentService.createViaUser(
      dto,
      assignedToId,
      userId,
    );
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Post('user-to-content-multiple/:assignedToId')
  @Roles('ADMIN')
  async createAssignedUserToContentMultiple(
    @Body() dto: AssignedUserToContentCreateArrayDto,
    @Param('assignedToId', ValidUserIdPipe) assignedToId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetDto[]> {
    const result = await this.assignedContentService.createViaUserMultiple(
      dto,
      assignedToId,
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
