import { Module } from '@nestjs/common';
import { UniqueEmailRule } from 'src/common/validator/unique_email.validator';
import { UniquePhoneRule } from 'src/common/validator/unique_phone.validator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UniqueEmailRule, UniquePhoneRule],
  exports: [UserService],
})
export class UserModule {}
