// src/app/features/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { AuthApiService, LoginRequest,LoginResponse } from '../api/auth-api.service';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = new AuthApiService();
  currentUser = signal<any>(null);
  
  constructor() {
    this.restoreUser();
  }
  
  restoreUser() {
    // Try to restore user from localStorage on service initialization
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        console.log('[AuthService] User restored from localStorage:', user);
      } catch (e) {
        console.error('[AuthService] Failed to parse stored user:', e);
        localStorage.removeItem('current_user');
      }
    }
  }
  
  login(data: LoginRequest): Observable<any> {
    return this.api.login(data).pipe(
      tap(res => {
        if (res.token){
          localStorage.setItem('auth_token', res.token);
          this.currentUser.set(res.user);
          localStorage.setItem('current_user', JSON.stringify(res.user));
          console.log('User logged in successfully, currentUser:', res.user);
        }
        else if (res.message){
          throw new Error('Invalid login response: missing token');
        }
        
      })
    );
  }
  
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
  }

  get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

}
