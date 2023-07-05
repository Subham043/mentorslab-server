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
import { ExamModule } from './exam/exam.module';
import { ExamUserController } from './exam/controller/exam.user.controller';
import { ExamAdminController } from './exam/controller/exam.admin.controller';
import { ExamAdminService } from './exam/services/exam.admin.service';
import { ExamUserService } from './exam/services/exam.user.service';
import { EnquiryModule } from './enquiry/enquiry.module';
import { EnquiryAdminController } from './enquiry/controller/enquiry.admin.controller';
import { EnquiryUserController } from './enquiry/controller/enquiry.user.controller';
import { EnquiryUserService } from './enquiry/services/enquiry.user.service';
import { EnquiryAdminService } from './enquiry/services/enquiry.admin.service';
import { DemoSessionModule } from './demo_session/demo_session.module';
import { DemoSessionUserController } from './demo_session/controller/demo_session.user.controller';
import { DemoSessionAdminController } from './demo_session/controller/demo_session.admin.controller';
import { DemoSessionAdminService } from './demo_session/services/demo_session.admin.service';
import { DemoSessionUserService } from './demo_session/services/demo_session.user.service';
import { EventModule } from './events/event.module';
import { EventAdminController } from './events/controller/event.admin.controller';
import { EventUserController } from './events/controller/event.user.controller';
import { EventAdminService } from './events/services/event.admin.service';
import { EventUserService } from './events/services/event.user.service';
import { EventCallToActionModule } from './event_call_to_action/event.module';
import { EventCallToActionAdminController } from './event_call_to_action/controller/event.admin.controller';
import { EventCallToActionAdminService } from './event_call_to_action/services/event.admin.service';
import { EventAboutAdminService } from './event_about/services/event.admin.service';
import { EventAboutAdminController } from './event_about/controller/event.admin.controller';
import { EventAboutModule } from './event_about/event.module';
import { EventTestimonialModule } from './events_testimonial/event_testimonial.module';
import { EventTestimonialAdminController } from './events_testimonial/controller/event_testimonial.admin.controller';
import { EventTestimonialAdminService } from './events_testimonial/services/event_testimonial.admin.service';
import { EventInstructorModule } from './events_instructor/event_instructor.module';
import { EventInstructorAdminController } from './events_instructor/controller/event_instructor.admin.controller';
import { EventInstructorAdminService } from './events_instructor/services/event_instructor.admin.service';
import { EventScheduleAdminController } from './events_schedule/controller/event_schedule.admin.controller';
import { EventScheduleAdminService } from './events_schedule/services/event_schedule.admin.service';
import { EventGalleryModule } from './events_gallery/event_gallery.module';
import { EventGalleryAdminController } from './events_gallery/controller/event_gallery.admin.controller';
import { EventGalleryAdminService } from './events_gallery/services/event_gallery.admin.service';
import { ExamQuestionAnswerModule } from './exam_question_answer/exam_question_answer.module';
import { ExamQuestionAnswerAdminController } from './exam_question_answer/controller/exam_question_answer.admin.controller';
import { ExamQuestionAnswerAdminService } from './exam_question_answer/services/exam_question_answer.admin.service';
import { AssessmentModule } from './assessment/assessment.module';
import { AssessmentCategoryModule } from './assessment_category/assessment_category.module';
import { AssessmentAdminController } from './assessment/controller/assessment.admin.controller';
import { AssessmentUserController } from './assessment/controller/assessment.user.controller';
import { AssessmentCategoryAdminController } from './assessment_category/controller/assessment_category.admin.controller';
import { AssessmentAdminService } from './assessment/services/assessment.admin.service';
import { AssessmentUserService } from './assessment/services/assessment.user.service';
import { AssessmentCategoryAdminService } from './assessment_category/services/assessment_category.admin.service';
import { AssessmentQuestionAnswerModule } from './assessment_question_answer/assessment_question_answer.module';
import { AssessmentQuestionAnswerAdminController } from './assessment_question_answer/controller/assessment_question_answer.admin.controller';
import { AssessmentQuestionAnswerAdminService } from './assessment_question_answer/services/assessment_question_answer.admin.service';
import { IttcModule } from './ittc/ittc.module';
import { IttcAdminController } from './ittc/controller/ittc.admin.controller';
import { IttcUserController } from './ittc/controller/ittc.user.controller';
import { IttcAdminService } from './ittc/services/ittc.admin.service';
import { IttcUserService } from './ittc/services/ittc.user.service';

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
    ExamModule,
    AssessmentModule,
    AssessmentCategoryModule,
    EnquiryModule,
    DemoSessionModule,
    EventModule,
    EventCallToActionModule,
    EventAboutModule,
    EventTestimonialModule,
    EventInstructorModule,
    EventGalleryModule,
    ExamQuestionAnswerModule,
    AssessmentQuestionAnswerModule,
    IttcModule,
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
    ExamAdminController,
    ExamUserController,
    AssessmentAdminController,
    AssessmentUserController,
    EnquiryAdminController,
    EnquiryUserController,
    DemoSessionAdminController,
    DemoSessionUserController,
    EventAdminController,
    EventUserController,
    EventCallToActionAdminController,
    EventAboutAdminController,
    EventTestimonialAdminController,
    EventInstructorAdminController,
    EventScheduleAdminController,
    EventGalleryAdminController,
    ExamQuestionAnswerAdminController,
    AssessmentQuestionAnswerAdminController,
    AssessmentCategoryAdminController,
    IttcAdminController,
    IttcUserController,
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
    ExamAdminService,
    ExamUserService,
    AssessmentAdminService,
    AssessmentUserService,
    EnquiryAdminService,
    EnquiryUserService,
    DemoSessionAdminService,
    DemoSessionUserService,
    EventAdminService,
    EventUserService,
    EventCallToActionAdminService,
    EventAboutAdminService,
    EventTestimonialAdminService,
    EventInstructorAdminService,
    EventScheduleAdminService,
    EventGalleryAdminService,
    ExamQuestionAnswerAdminService,
    AssessmentQuestionAnswerAdminService,
    AssessmentCategoryAdminService,
    IttcAdminService,
    IttcUserService,
  ],
})
export class AppModule {}
