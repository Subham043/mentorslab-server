import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'SubscriptionPhoneExistsRule', async: true })
@Injectable()
export class SubscriptionPhoneExistsRule
  implements ValidatorConstraintInterface
{
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          phone: value,
        },
      });
      if (subscription) return false;
      return true;
    } catch (e) {
      return true;
    }
  }

  defaultMessage() {
    return `This phone number is already a member!`;
  }
}

export function SubscriptionPhoneExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SubscriptionPhoneExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SubscriptionPhoneExistsRule,
    });
  };
}
