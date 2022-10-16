import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'EmailExistsRule', async: true })
@Injectable()
export class EmailExistsRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: value,
          verified: true,
          blocked: false,
        },
      });
      if (!user) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email doesnot exists!`;
  }
}

export function EmailExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EmailExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailExistsRule,
    });
  };
}
