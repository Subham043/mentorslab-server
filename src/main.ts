import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer, ValidationError } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const result = {};
        validationErrors.forEach((element) => {
          console.log(element);
          result[element.property] = Object.values(element.constraints);
        });

        return new HttpException(
          { form_error: result },
          HttpStatus.BAD_REQUEST,
        );
      },
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: function (origin, callback) {
      const whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000'];
      if (origin) {
        if (whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else callback(null, true);
      // callback(null, true);
    },
  });
  await app.listen(process.env.PORT || 3300);
}
bootstrap();
