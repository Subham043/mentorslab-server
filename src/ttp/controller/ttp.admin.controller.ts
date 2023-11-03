import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { TtpAdminService } from '../services/ttp.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('ttp')
export class TtpAdminController {
  constructor(private eventService: TtpAdminService) {}

  @Get('registration')
  @Roles('ADMIN')
  async getAllRegistrationPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<any> {
    const result = await this.eventService.findAllRegistrationPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }
}
