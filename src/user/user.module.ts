import { Module } from '@nestjs/common';
import { UniqueEmailRule } from 'src/common/validator/unique_email.validator';
import { UniquePhoneRule } from 'src/common/validator/unique_phone.validator';
import { UserProfileAdminController } from './controller/user.admin.controller';
import { UserProfileController } from './controller/user.user.controller';
import { UserProfileAdminService } from './services/user.admin.service';
import { UserProfileService } from './services/user.user.service';

@Module({
  controllers: [UserProfileController, UserProfileAdminController],
  providers: [
    UserProfileService,
    UserProfileAdminService,
    UniqueEmailRule,
    UniquePhoneRule,
  ],
  exports: [UserProfileAdminService],
})
export class UserModule {}
