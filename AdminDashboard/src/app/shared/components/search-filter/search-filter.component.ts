import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SearchField {
  key: string;
  placeholder: string;
}

export interface FilterField {
  key: string;
  label: string;
  options: { label: string; value: any }[];
}

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {

  @Input() searchFields: SearchField[] = [];
  @Input() filterFields: FilterField[] = [];
  // show a global search input that searches across all fields
  @Input() enableGlobalSearch = true;
  @Input() globalPlaceholder = 'Search all fields';

  @Output() queryChanged = new EventEmitter<any>();

  searchValues = signal<any>({});
  filterValues = signal<any>({});

  updateSearch(key: string, value: string) {
    this.searchValues.update(v => ({ ...v, [key]: value }));
    this.emitChanges();
  }

  updateFilter(key: string, value: any) {
    this.filterValues.update(v => ({ ...v, [key]: value }));
    this.emitChanges();
  }

  emitChanges() {
    this.queryChanged.emit({
      search: this.searchValues(),
      filter: this.filterValues()
    });
  }
}
