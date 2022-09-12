import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ name: 'EmailUpdateTaken', async: true })
@Injectable()
export class EmailUpdateTakenRule implements ValidatorConstraintInterface {
  constructor(private usersRepository: UserService) {}

  async validate(value: string) {
    try {
      const user = await this.usersRepository.findByEmail(value);
      if(user.email===value) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Email is already taken`;
  }
}