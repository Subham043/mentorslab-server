import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { ContentModule } from './content/content.module';
import { AssignedContentAdminService } from './assigned_content/services/assigned_content.admin.service';
import { AssignedContentAdminController } from './assigned_content/controller/assigned_content.admin.controller';
import { AssignedContentModule } from './assigned_content/assigned_content.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UserProfileController } from './user/controller/user.user.controller';
import { UserProfileAdminController } from './user/controller/user.admin.controller';
import { UserProfileAdminService } from './user/services/user.admin.service';
import { UserProfileService } from './user/services/user.user.service';
import { ContentAdminController } from './content/controller/content.admin.controller';
import { ContentAdminService } from './content/services/content.admin.service';
import { LiveSessionContentAdminController } from './live_session_content/controller/live_session_content.admin.controller';
import { LiveSessionContentAdminService } from './live_session_content/services/live_session_content.admin.service';
import { ContentUserService } from './content/services/content.user.service';
import { ContentUserController } from './content/controller/content.user.controller';
import { LiveSessionContentUserController } from './live_session_content/controller/live_session_content.user.controller';
import { LiveSessionContentUserService } from './live_session_content/services/live_session_content.user.service';
import { PaymentModule } from './payment/payment.module';
import { PaymentAdminController } from './payment/controller/payment.admin.controller';
import { PaymentAdminService } from './payment/services/payment.admin.service';
import { MailModule } from './mail/mail.module';
import { LiveSessionAssignedContentModule } from './live_session_assigned_content/live_session_assigned_content.module';
import { LiveSessionAssignedContentAdminService } from './live_session_assigned_content/services/live_session_assigned_content.admin.service';
import { LiveSessionAssignedContentAdminController } from './live_session_assigned_content/controller/live_session_assigned_content.admin.controller';
import { LiveSessionAssignedContentUserController } from './live_session_assigned_content/controller/live_session_assigned_content.user.controller';
import { LiveSessionAssignedContentUserService } from './live_session_assigned_content/services/live_session_assigned_content.user.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

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
    PaymentModule,
    AssignedContentModule,
    NestjsFormDataModule,
    MailModule,
    DashboardModule,
    LiveSessionAssignedContentModule,
    LiveSessionAssignedContentModule,
  ],
  controllers: [
    AppController,
    AuthController,
    DashboardController,
    UserProfileController,
    UserProfileAdminController,
    ContentAdminController,
    ContentUserController,
    LiveSessionContentAdminController,
    LiveSessionContentUserController,
    AssignedContentAdminController,
    PaymentAdminController,
    LiveSessionAssignedContentAdminController,
    LiveSessionAssignedContentUserController,
  ],
  providers: [
    AppService,
    AuthService,
    DashboardService,
    UserProfileAdminService,
    UserProfileService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    ContentAdminService,
    ContentUserService,
    LiveSessionContentAdminService,
    LiveSessionContentUserService,
    AssignedContentAdminService,
    PaymentAdminService,
    LiveSessionAssignedContentAdminService,
    LiveSessionAssignedContentUserService,
  ],
})
export class AppModule {}
