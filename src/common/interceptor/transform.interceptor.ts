import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TransformInterceptorResponse } from './dto/transform.interceptor.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformInterceptorResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformInterceptorResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data,
      })),
    );
    // return next.handle().pipe(map((data) => data));
  }
}
