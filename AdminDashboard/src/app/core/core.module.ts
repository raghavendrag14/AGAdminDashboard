import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { RetryInterceptor } from './interceptors/retry.interceptor';

@NgModule({
  // CoreModule previously provided class-based HTTP_INTERCEPTORS.
  // We now register functional interceptors via `provideHttpClient(withInterceptors(...))`
  // in `main.ts`. Keep this module present for other core providers, but remove
  // HTTP_INTERCEPTORS to avoid duplicate/early provider initialization.
  providers: []
})
export class CoreModule {}
