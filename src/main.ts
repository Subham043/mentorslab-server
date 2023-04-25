import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer, ValidationError } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'style-src': ["'self'"],
          'script-src': ["'self'"],
          'font-src': ["'self'"],
          'object-src': ["'self'"],
          'img-src': ["'self'", process.env.CLIENT_URL],
          'frame-src': ["'self'", process.env.CLIENT_URL],
          'frame-ancestors': ["'self'", process.env.CLIENT_URL],
          'connect-src': ["'self'", process.env.CLIENT_URL],
          'form-action': ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: {
        action: 'sameorigin',
      },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      referrerPolicy: { policy: 'no-referrer' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true,
      },
      xssFilter: true,
    }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const result = {};
        validationErrors.forEach((element) => {
          // console.log(element);
          result[element.property] = Object.values(element.constraints);
        });

        return new HttpException(
          { form_error: result },
          HttpStatus.BAD_REQUEST,
        );
      },
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'Range',
    ],
    origin: function (origin, callback) {
      const whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000'];
      if (origin) {
        if (whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else callback(null, true);
    },
    credentials: true,
    exposedHeaders: 'Content-Length',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });
  await app.listen(process.env.PORT || 3300);
}
bootstrap();
