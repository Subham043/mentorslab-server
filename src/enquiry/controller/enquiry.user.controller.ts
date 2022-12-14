import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { EnquiryUserCreateDto } from '../dto';
import { Public } from 'src/common/decorator/public.decorator';
import { EnquiryUserService } from '../services/enquiry.user.service';
import { Throttle } from '@nestjs/throttler';

@Controller('enquiry-user')
export class EnquiryUserController {
  constructor(private enquiryService: EnquiryUserService) {}

  @Public()
  @Post()
  @Throttle(3, 60)
  async createEnquiry(
    @Body() enquiryCreateDto: EnquiryUserCreateDto,
  ): Promise<string> {
    const result = await this.enquiryService.create(enquiryCreateDto);
    if (!result)
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    return 'Message sent successfully';
  }
}
