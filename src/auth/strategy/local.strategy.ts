import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(authDto: AuthDto): Promise<any> {
    const user = await this.authService.validateUser(authDto);
    if(!user) throw new HttpException("Invalid Credentials", HttpStatus.UNAUTHORIZED)
    return user;
  }
}