import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'UniqueUrlRule', async: true })
@Injectable()
export class UniqueUrlRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const user = await this.prisma.event.findFirst({
        where: { url: value },
      });
      if (user) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `URL is already taken`;
  }
}

export function UniqueUrl(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueUrlRule,
    });
  };
}
