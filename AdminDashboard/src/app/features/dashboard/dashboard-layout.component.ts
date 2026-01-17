import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage,NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { NgIf } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-dashboard-layout',
  imports: [CommonModule, NgIf, RouterLink, RouterOutlet, LeftSidebarComponent, RightSidebarComponent, NgOptimizedImage,PageHeaderComponent,NgTemplateOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent {
  constructor(public auth: AuthService, private router: Router,public sidebar: SidebarService) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
