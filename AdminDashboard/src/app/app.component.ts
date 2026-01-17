import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- modal host -->
    <app-modal></app-modal>
  `
})
export class AppComponent {
  title = 'admin-dashboard';
}
