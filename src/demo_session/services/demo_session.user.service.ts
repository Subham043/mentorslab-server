import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemoSessionUserCreateDto } from '../dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class DemoSessionUserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(dto: DemoSessionUserCreateDto): Promise<string | undefined> {
    const { email, phone, name, message } = dto;
    await this.prisma.demoSession.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    this.mailService.demoSession(dto);
    return 'Message sent successfully';
  }
}
