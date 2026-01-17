import { Component, Inject, Optional, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user =  signal<User | null>(null);
  loading = signal(false);
  error: string | null = null;

  constructor(
    private api: UserApiService,
    @Optional() @Inject('modalData') public data: any,
    @Optional() @Inject('modalClose') public close: (val: any) => void
  ) {}

  ngOnInit() {
    if (this.data?.userId) {
      this.loadUserProfile(this.data.userId);
    } else if (this.data?.user?._id) {
      this.loadUserProfile(this.data.user._id);
    }
  }

  loadUserProfile(userId: string) {
    this.loading.set(true);
    this.error = null;

    this.api.getUserById(userId).subscribe({
      next: (response: any) => {
        console.log('User profile response:', response);
        // Handle different response structures
        const userData = response.user || response.data || response;
        if (userData && userData._id) {
          this.user.set(userData);
          this.error = null;
        } else {
          this.error = 'User not found';
          this.user.set(null);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading user profile:', err);
        this.error = err?.error?.message || 'Failed to load user profile';
        this.user.set(null);
        this.loading.set(false);
      }
    });
  }

  closeModal() {
    if (this.close) {
      this.close(null);
    }
  }
}
