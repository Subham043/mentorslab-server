import {
  Controller,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access_token.guard';
import { GetCurrentUserId } from 'src/common/decorator/get_current_user_id.decorator';
import { DashboardService } from './dashboard.service';

@UseGuards(AccessTokenGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('/')
  async dashboard(@GetCurrentUserId() userId: number): Promise<any> {
    const result = await this.dashboardService.dashboard(userId);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
