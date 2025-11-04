// src/app/features/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { AuthApiService, LoginRequest,LoginResponse } from '../api/auth-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = new AuthApiService();
  readonly currentUser = signal<any>(null);
  async login(data: LoginRequest) {
    const res = await firstValueFrom(this.api.login(data));
    localStorage.setItem('auth_token', res.token);
    this.currentUser.set(res.user);
    return res.user;
  }
  
  logout() {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
  }

  get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

}
