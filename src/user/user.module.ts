import { Module } from '@nestjs/common';
import { UniqueEmail } from 'src/common/validator/unique_email.validator';
import { UniquePhone } from 'src/common/validator/unique_phone.validator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UniqueEmail, UniquePhone],
  exports: [UserService],
})
export class UserModule {}
