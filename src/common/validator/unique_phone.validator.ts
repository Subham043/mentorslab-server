import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ name: 'UniquePhone', async: true })
@Injectable()
export class UniquePhone implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(value: string) {
    try {
      const user = await this.userService.findByPhone(value);
      if (user) return false;
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Phone is already taken`;
  }
}
