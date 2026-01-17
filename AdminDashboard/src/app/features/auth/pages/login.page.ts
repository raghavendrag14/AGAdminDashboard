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

  constructor(private auth: AuthService, private router: Router) {
    let token = localStorage.getItem('auth_token');
    
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
     this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (res) => {
        this.loading = false;
        console.error('Login error:', res);
        this.error = 'Invalid credentials';
      }
    });
    }
    catch (err) {
      this.error = 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
