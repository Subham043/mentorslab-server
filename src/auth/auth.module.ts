import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategy/access_token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh_token.strategy';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmailExistsRule } from 'src/common/validator/email_exists.validator';
import { UniqueEmailRule } from 'src/common/validator/unique_email.validator';
import { UniquePhoneRule } from 'src/common/validator/unique_phone.validator';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRY_TIME || '60s' },
    }),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    EmailExistsRule,
    UniqueEmailRule,
    UniquePhoneRule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
