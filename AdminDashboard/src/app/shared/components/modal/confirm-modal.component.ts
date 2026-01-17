import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './model.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      {{ title }}
      <button class="modal-close" (click)="close(false)">×</button>
    </div>

    <div class="modal-body">
      <p>{{ message }}</p>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary" (click)="close(false)">Cancel</button>
      <button class="btn btn-primary" (click)="close(true)">Confirm</button>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() title!: string;
  @Input() message!: string;

  constructor(private modal: ModalService) {}

  close(value: boolean) {
    this.modal.close(value);
  }
}
