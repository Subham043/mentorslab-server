import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ name: 'EmailTaken', async: true })
@Injectable()
export class PhoneTakenRule implements ValidatorConstraintInterface {
  constructor(private usersRepository: UserService) {}

  async validate(value: string) {
    try {
      await this.usersRepository.findByPhone(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Phone is already taken`;
  }
}