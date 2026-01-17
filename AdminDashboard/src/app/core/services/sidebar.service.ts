// src/app/core/services/sidebar.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  leftOpen = signal(false);
  rightOpen = signal(false);
  toggleTheme = signal(false);

  toggleLeft() {
    this.leftOpen.update(v => !v);
  }

  toggleRight() {
    this.rightOpen.update(v => !v);
  }

  closeAll() {
    this.leftOpen.set(false);
    this.rightOpen.set(false);
  }
  toggleThemeMode() {
    this.toggleTheme.update(v => !v);
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
}
