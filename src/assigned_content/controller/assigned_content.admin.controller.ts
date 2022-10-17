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
import { AssignedContentAdminService } from '../services/assigned_content.admin.service';
import {
  AssignedContentGetAdminDto,
  AssignedContentToUserCreateArrayAdminDto,
  AssignedContentToUserCreateAdminDto,
  AssignedUserToContentCreateArrayAdminDto,
  AssignedUserToContentCreateAdminDto,
} from '../dto';

@UseGuards(AccessTokenGuard)
@Controller('assign')
export class AssignedContentAdminController {
  constructor(private assignedContentService: AssignedContentAdminService) {}

  @Post('content-to-user/:contentId')
  @Roles('ADMIN')
  async createAssignedContentToUser(
    @Body() dto: AssignedContentToUserCreateAdminDto,
    @Param('contentId', ValidContentIdPipe) contentId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetAdminDto> {
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
    @Body() dto: AssignedContentToUserCreateArrayAdminDto,
    @Param('contentId', ValidContentIdPipe) contentId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetAdminDto[]> {
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
    @Body() dto: AssignedUserToContentCreateAdminDto,
    @Param('assignedToId', ValidUserIdPipe) assignedToId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetAdminDto> {
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
    @Body() dto: AssignedUserToContentCreateArrayAdminDto,
    @Param('assignedToId', ValidUserIdPipe) assignedToId: number,
    @GetCurrentUserId() userId: number,
  ): Promise<AssignedContentGetAdminDto[]> {
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
  async getAllContent(): Promise<AssignedContentGetAdminDto[]> {
    const result = await this.assignedContentService.findAll();
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AssignedContentGetAdminDto> {
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
