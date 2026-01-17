import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { NgTemplateOutlet } from '@angular/common';
import { SidebarService } from '../../../core/services/sidebar.service';
@Component({
  standalone: true,
  selector: 'app-dashboard-content',
  imports: [CommonModule,RouterLink, LeftSidebarComponent, RightSidebarComponent,NgOptimizedImage,PageHeaderComponent,NgTemplateOutlet],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent {
constructor(public auth: AuthService, private router: Router,public sidebar: SidebarService) {}


}
