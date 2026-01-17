import { Component, Input, TemplateRef } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [BreadcrumbComponent, NgIf, NgTemplateOutlet],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() actionsTemplate?: TemplateRef<any>;
}
