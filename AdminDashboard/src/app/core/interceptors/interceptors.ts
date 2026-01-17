import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, tap, retryWhen, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};

export const errorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API error intercepted:', error);
      // Avoid injecting Router here (can create cyclic/early injection issues).
      // Fallback to simple navigation for common auth errors.
      if (error.status === 401) {
        window.location.href = '/login';
      }
      if (error.status === 403) {
        window.location.href = '/forbidden';
      }
      return throwError(() => error);
    })
  );
};

export const loggingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  console.log('HTTP Request:', req.url, req.method);
  return next(req).pipe(
    tap(event => console.log('HTTP Response event:', event))
  );
};

export const retryInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Use configuration from environment to avoid injecting services here
  const { maxRetries, scalingDuration, retryStatusCodes } = environment['retry'] || {
    maxRetries: 3,
    scalingDuration: 1000,
    retryStatusCodes: [500, 502, 503, 504]
  };

  return next(req).pipe(
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
};