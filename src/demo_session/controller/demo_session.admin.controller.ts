import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { DemoSessionAdminPaginateDto } from '../dto';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { DemoSessionAdminService } from '../services/demo_session.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('demo-session')
export class DemoSessionAdminController {
  constructor(private demoSessionService: DemoSessionAdminService) {}

  @Get('paginate')
  @Roles('ADMIN')
  async getAllDemoSessionPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<DemoSessionAdminPaginateDto> {
    const result = await this.demoSessionService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }
}
