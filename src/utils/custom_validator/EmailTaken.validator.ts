import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ name: 'EmailTaken', async: true })
@Injectable()
export class EmailTakenRule implements ValidatorConstraintInterface {
  constructor(private usersRepository: UserService) {}

  async validate(value: string) {
    try {
      const user = await this.usersRepository.findByEmail(value);
      console.log(user);
      
      if (user) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Email is already taken`;
  }
}