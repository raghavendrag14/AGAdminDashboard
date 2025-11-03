export interface AppConfig {
  apiBase: string;

  retry: {
    maxRetries: number;
    scalingDuration: number; // base delay in ms
    retryStatusCodes: number[];
  };

  features: {
    enableAuditLogs: boolean;
    enableMockApi: boolean;
  };
}
