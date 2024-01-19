import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'SubscriptionEmailExistsRule', async: true })
@Injectable()
export class SubscriptionEmailExistsRule
  implements ValidatorConstraintInterface
{
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const subscription = await this.prisma.subscription.findFirst({
        where: {
          email: value,
        },
      });
      if (subscription) return false;
      return true;
    } catch (e) {
      return true;
    }
  }

  defaultMessage() {
    return `This email is already a member!`;
  }
}

export function SubscriptionEmailExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'SubscriptionEmailExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SubscriptionEmailExistsRule,
    });
  };
}
