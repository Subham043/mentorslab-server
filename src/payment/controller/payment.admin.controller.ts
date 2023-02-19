import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ValidPaginatePipe } from 'src/common/pipes/valid_paginate.pipes';
import { PaymentAdminService } from '../services/payment.admin.service';

@UseGuards(AccessTokenGuard)
@Controller('payment')
export class PaymentAdminController {
  constructor(private paymentService: PaymentAdminService) {}

  @Get('content-paginate')
  @Roles('ADMIN')
  async getAllContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<any> {
    const result = await this.paymentService.findContentAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get('live-session-content-paginate')
  @Roles('ADMIN')
  async getAllLiveSessionContentPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<any> {
    const result = await this.paymentService.findLiveSessionContentAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }

  @Get('exam-paginate')
  @Roles('ADMIN')
  async getAllExamPaginate(
    @Query('skip', ValidPaginatePipe) skip: string,
    @Query('take', ValidPaginatePipe) take: string,
  ): Promise<any> {
    const result = await this.paymentService.findExamAllPaginate({
      skip: Number(skip),
      take: Number(take),
    });
    return result;
  }
}
