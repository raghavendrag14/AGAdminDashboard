import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { User } from '../../models/user.model';
import { UserApiService } from '../../services/user-api.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent implements OnInit {
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  userId: string | null = null;

  constructor(
    private userApi: UserApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // If route has ID parameter, use it; otherwise use current user's ID
      const id = params['id'];
      if (id) {
        this.userId = id;
      } else {
        // For /my-profile route, get current user ID from auth service
        const currentUser = this.authService.currentUser();
        this.userId = currentUser?._id || currentUser?.id;
        console.log('[UserProfilePage] Using currentUser ID:', this.userId, 'currentUser:', currentUser);
      }

      if (this.userId) {
        this.loadUserProfile(this.userId);
      } else {
        this.error.set('User ID not found');
      }
    });
  }

  loadUserProfile(userId: string) {
    this.loading.set(true);
    this.error.set(null);

    this.userApi.getUserById(userId).subscribe({
      next: (response: any) => {
        console.log('[UserProfilePage] User profile loaded:', response);
        const userData = response.user || response.data || response;
        if (userData && userData._id) {
          this.user.set(userData);
          this.error.set(null);
        } else {
          this.error.set('User data not found in response');
          this.user.set(null);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('[UserProfilePage] Error loading user profile:', err);
        this.error.set(err?.error?.message || 'Failed to load user profile');
        this.user.set(null);
        this.loading.set(false);
      }
    });
  }

  onBack() {
    this.router.navigate(['/dashboard/users']);
  }

  getInitials(user: User | null): string {
    if (!user) return '';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }
}
