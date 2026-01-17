// src/app/features/auth/api/auth-api.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    roles: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private api = inject(ApiService);

  login(data: LoginRequest) {
    return this.api.post<LoginResponse>('auth', data);
  }
}
