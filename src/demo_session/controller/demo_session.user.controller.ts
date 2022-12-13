import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { DemoSessionUserCreateDto } from '../dto';
import { Public } from 'src/common/decorator/public.decorator';
import { DemoSessionUserService } from '../services/demo_session.user.service';

@Controller('demo-session-user')
export class DemoSessionUserController {
  constructor(private demoSessionService: DemoSessionUserService) {}

  @Public()
  @Post()
  async createDemoSession(
    @Body() demoSessionCreateDto: DemoSessionUserCreateDto,
  ): Promise<string> {
    const result = await this.demoSessionService.create(demoSessionCreateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return 'Message sent successfully';
  }
}
