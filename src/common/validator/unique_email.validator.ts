import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'UniqueEmailRule', async: true })
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: value },
      });
      if (user) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email is already taken`;
  }
}

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueEmailRule,
    });
  };
}
