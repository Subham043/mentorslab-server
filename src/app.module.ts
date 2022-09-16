import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { ContentController } from './content/content.controller';
import { ContentService } from './content/content.service';
import { ContentModule } from './content/content.module';
import { AssignedContentService } from './assigned_content/assigned_content.service';
import { AssignedContentController } from './assigned_content/assigned_content.controller';
import { AssignedContentModule } from './assigned_content/assigned_content.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRY_TIME || '60s' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    ContentModule,
    AssignedContentModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ContentController,
    AssignedContentController,
  ],
  providers: [
    AppService,
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    ContentService,
    AssignedContentService,
  ],
})
export class AppModule {}
