import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnquiryAdminPaginateDto } from '../dto';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { EnquiryAdminService } from '../services/enquiry.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('enquiry')
export class EnquiryAdminController {
  constructor(private enquiryService: EnquiryAdminService) {}

  @Get('paginate')
  @Roles('ADMIN')
  async getAllEnquiryPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<EnquiryAdminPaginateDto> {
    const result = await this.enquiryService.findAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }
}
