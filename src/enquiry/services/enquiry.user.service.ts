import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnquiryUserCreateDto } from '../dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EnquiryUserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(dto: EnquiryUserCreateDto): Promise<string | undefined> {
    const { email, phone, name, message } = dto;
    await this.prisma.enquiries.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    return 'Message sent successfully';
  }
}
