import { Component, HostListener, inject } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuApiService } from '../api/menu-api.service';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe, RouterLink],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent {
  //private menuApi = );
  //menus$: Observable<Menu[]> = this.menuApi.getMenus();
menus: Menu[] = [];
  constructor(public sidebar: SidebarService,public menuAPI:MenuApiService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.left-sidebar') && !target.closest('.menu-button')) {
      this.sidebar.leftOpen.set(false);
    }
  }

    ngOnInit() {
    this.loadMenus();
  }
    loadMenus() {
        this.menuAPI.getMenus().subscribe(response => {
      // 'response.data' contains the array you need
      this.menus = response.menuDetails;
      console.log('Menus loaded:', this.menus)
    });
    }
}
