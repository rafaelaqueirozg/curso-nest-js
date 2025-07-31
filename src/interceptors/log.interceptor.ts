import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const date = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request: Request = context.switchToHttp().getRequest();

        console.log(`${request.method} - ${request.url}`);
        console.log('Execução levou: ', Date.now() - date, 'ms');
      }),
    );
  }
}
