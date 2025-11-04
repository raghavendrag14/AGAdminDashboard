import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header style="padding:12px 0; border-bottom:1px solid #eee;">
      <h1>Admin Dashboard</h1>
    </header>
    <main style="padding:16px;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
