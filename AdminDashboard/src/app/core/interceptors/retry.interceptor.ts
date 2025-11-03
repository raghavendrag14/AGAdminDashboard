import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  constructor(private config: AppConfigService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { maxRetries, scalingDuration, retryStatusCodes } = this.config.value.retry;
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, retryCount) => {
            if (
              retryCount < maxRetries &&
              error instanceof HttpErrorResponse &&
              retryStatusCodes.includes(error.status)
            ) {
              const backoffTime = scalingDuration * Math.pow(2, retryCount);
              console.warn(`Retrying ${req.url} (attempt ${retryCount + 1}) in ${backoffTime}ms`);
              return timer(backoffTime);
            }
            return throwError(() => error);
          })
        )
      )
    );
  }
}
