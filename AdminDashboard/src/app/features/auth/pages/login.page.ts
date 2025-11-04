// src/app/features/auth/pages/login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login({ username: this.username, password: this.password });
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message || 'Invalid credentials';
    } finally {
      this.loading = false;
    }
  }
}
