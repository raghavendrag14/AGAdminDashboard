import { Injectable } from '@angular/core';
import { AppConfig } from './app-config.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly config: AppConfig = {
    apiBase: environment.apiBase,
    retry: {
      maxRetries: 3,
      scalingDuration: 1000,
      retryStatusCodes: [500, 502, 503, 504],
    },
    features: {
      enableAuditLogs: true,
      enableMockApi: !environment.production,
    },
  };

  get value(): AppConfig { return this.config; }
}
