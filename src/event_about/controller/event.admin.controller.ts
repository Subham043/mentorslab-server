import {
  Controller,
  UseGuards,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EventAdminCreateDto, EventAdminGetDto } from '../dto';
import { ValidEventIdPipe } from 'src/common/pipes/valid_event_id.pipes';
import { EventAboutAdminService } from '../services/event.admin.service';
import { FormDataRequest } from 'nestjs-form-data';

@UseGuards(AccessTokenGuard)
@Controller('event-about')
export class EventAboutAdminController {
  constructor(private eventService: EventAboutAdminService) {}

  @Post(':id')
  @Roles('ADMIN')
  @FormDataRequest()
  async createContent(
    @Body() eventCreateDto: EventAdminCreateDto,
    @Param('id', ValidEventIdPipe) id: number,
  ): Promise<EventAdminGetDto> {
    const result = await this.eventService.create(eventCreateDto, id);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get(':id')
  @Roles('ADMIN')
  async getContent(
    @Param('id', ValidEventIdPipe) id: number,
  ): Promise<EventAdminGetDto> {
    const result = await this.eventService.findOne(id);
    return result;
  }
}
