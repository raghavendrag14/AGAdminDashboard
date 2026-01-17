import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  // use internal signals for inputs so computed values react to Input changes
  private totalItemsSignal = signal<number>(0);
  private pageSizeSignal = signal<number>(10);

  @Input() set totalItems(v: number) {
    this.totalItemsSignal.set(v ?? 0);
  }
  get totalItems() {
    return this.totalItemsSignal();
  }

  @Input() set pageSize(v: number) {
    this.pageSizeSignal.set(v ?? 10);
  }
  get pageSize() {
    return this.pageSizeSignal();
  }

  currentPage = signal(1);

  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  // computed list of page numbers to render (minimum window of 5 numbers when possible)
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const window = 5;
    if (total <= window) return Array.from({ length: total }, (_, i) => i + 1);
    // try to center current page in window
    let start = Math.max(1, current - Math.floor(window / 2));
    let end = start + window - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - window + 1);
    }
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  });

  totalPages = computed(() => Math.ceil(this.totalItemsSignal() / this.pageSizeSignal()));

  // update page size from parent/template
  setPageSize(size: number) {
    const s = Math.max(1, Number(size) || 1);
    this.pageSizeSignal.set(s);
    // reset to page 1
    this.currentPage.set(1);
    this.pageSizeChanged.emit(s);
    this.pageChanged.emit(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.pageChanged.emit(page);
  }

  isActive(page: number) {
    return this.currentPage() === page;
  }
}
