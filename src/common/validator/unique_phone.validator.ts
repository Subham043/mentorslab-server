import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'UniquePhoneRule', async: true })
@Injectable()
export class UniquePhoneRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          phone: value,
        },
      });
      if (user) return false;
    } catch (e) {
      console.log(e);

      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Phone is already taken`;
  }
}

export function UniquePhone(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniquePhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniquePhoneRule,
    });
  };
}
