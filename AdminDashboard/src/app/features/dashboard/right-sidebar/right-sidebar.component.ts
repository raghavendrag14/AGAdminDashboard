import { Component, HostListener } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent {
  constructor(public auth: AuthService, private router: Router, public sidebar: SidebarService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.right-sidebar') && !target.closest('.navbar-profile')) {
      this.sidebar.rightOpen.set(false);
    }
  }

  onProfile($event: Event) {
    $event.preventDefault();
    console.log('[RightSidebar] onProfile clicked, currentUser:', this.auth.currentUser());
    
    if (this.auth.currentUser() && this.auth.currentUser().id) {
      console.log('[RightSidebar] Navigating to profile page for user:', this.auth.currentUser().id);
      this.router.navigate(['/dashboard/profile', this.auth.currentUser().id]);
      this.sidebar.rightOpen.set(false);
    } else {
      console.warn('[RightSidebar] No currentUser found');
      alert('Unable to load profile: Current user not found');
    }
  }

  logout($event: Event) {
    $event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

