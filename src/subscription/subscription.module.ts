import { Module } from '@nestjs/common';
import { SubscriptionEmailExistsRule } from 'src/common/validator/subscription_email_exists.validator';
import { SubscriptionPhoneExistsRule } from 'src/common/validator/subscription_phone_exists.validator';

@Module({
  providers: [SubscriptionPhoneExistsRule, SubscriptionEmailExistsRule],
})
export class SubscriptionModule {}
