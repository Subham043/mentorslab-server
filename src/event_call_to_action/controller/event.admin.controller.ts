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
import { EventCallToActionAdminService } from '../services/event.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('event-call-to-action')
export class EventCallToActionAdminController {
  constructor(private eventService: EventCallToActionAdminService) {}

  @Post(':id')
  @Roles('ADMIN')
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
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
