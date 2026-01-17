import { signal, computed } from '@angular/core';
import { SearchField, FilterField } from '../components/search-filter/search-filter.component';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfigItem {
  key: string;
  label?: string;
  sortable?: boolean;
}

export interface TableController<T = any> {
  // query state (search + filter)
  queryState: ReturnType<typeof signal>;
  setQuery(q: { search?: Record<string, any>; filter?: Record<string, any> }): void;

  // pagination
  page: ReturnType<typeof signal>;
  pageSize: ReturnType<typeof signal>;
  totalItems: ReturnType<typeof computed>;
  totalPages: ReturnType<typeof computed>;
  paginatedData: ReturnType<typeof computed>;
  setPage(p: number): void;
  setPageSize(s: number): void;

  // sorting
  sortKey: ReturnType<typeof signal>;
  sortDir: ReturnType<typeof signal>;
  setSort(key: string | null, dir: SortDirection): void;
  // metadata
  searchFields?: SearchField[];
  filterFields?: FilterField[];
  sortConfig?: SortConfigItem[];
}

/**
 * Create a generic table controller that handles search, filter, sort and pagination.
 * itemsGetter should return the current full array to be paginated (e.g. () => users()).
 */
export function createTableController<T = any>(itemsGetter: () => T[], opts?: { pageSize?: number; searchFields?: SearchField[]; filterFields?: FilterField[]; sortConfig?: SortConfigItem[] }): TableController<T> {
  const searchFields = opts?.searchFields ?? [];
  const filterFields = opts?.filterFields ?? [];
  const sortConfig = opts?.sortConfig ?? [];

  const queryState = signal<{ search: Record<string, any>; filter: Record<string, any> }>({ search: {}, filter: {} });

  const page = signal(1);
  const pageSize = signal(opts?.pageSize ?? 10);

  const sortKey = signal<string | null>(null);
  const sortDir = signal<SortDirection>(null);

  const filteredData = computed(() => {
    const items = itemsGetter() || [];
    const { search, filter } = queryState();
    return items.filter((item: any) => {
      let matches = true;
      // search: only keys declared in searchFields are considered (if provided)
      const allowedSearchKeys = (searchFields || []).map(s => s.key);
      Object.keys(search || {}).forEach(key => {
        const sv = search[key];
        if (!sv) return;
        // special global search key: '__any' -> search across all fields of the item
        if (key === '__any') {
          const needle = String(sv).toLowerCase();
          const found = Object.keys(item || {}).some(k => {
            const v = item?.[k];
            if (v == null) return false;
            return String(v).toLowerCase().includes(needle);
          });
          if (!found) matches = false;
          return;
        }

        if (allowedSearchKeys.length && !allowedSearchKeys.includes(key)) return;
        if (sv && !(item?.[key] ?? '').toString().toLowerCase().includes(String(sv).toLowerCase())) {
          matches = false;
        }
      });
      // filter: only keys declared in filterFields are considered (if provided)
      const allowedFilterKeys = (filterFields || []).map(f => f.key);
      Object.keys(filter || {}).forEach(key => {
        if (allowedFilterKeys.length && !allowedFilterKeys.includes(key)) return;
        const fv = filter[key];
        if (fv != null && fv !== '' && item?.[key] !== fv) matches = false;
      });
      return matches;
    });
  });

  const sortedData = computed(() => {
    const list = [...filteredData()];
    const key = sortKey();
    const dir = sortDir();
    if (!key || !dir) return list;
    // ensure key is allowed by sortConfig (if provided)
    const allowedSortKeys = (sortConfig || []).filter(s => s.sortable).map(s => s.key);
    if (allowedSortKeys.length && !allowedSortKeys.includes(key)) return list;
    list.sort((a: any, b: any) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (av == null && bv == null) return 0;
      if (av == null) return dir === 'asc' ? -1 : 1;
      if (bv == null) return dir === 'asc' ? 1 : -1;
      if (typeof av === 'number' && typeof bv === 'number') return dir === 'asc' ? av - bv : bv - av;
      const sa = String(av).toLowerCase();
      const sb = String(bv).toLowerCase();
      if (sa < sb) return dir === 'asc' ? -1 : 1;
      if (sa > sb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  });

  const totalItems = computed(() => sortedData().length);
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems() / pageSize())));

  const paginatedData = computed(() => {
    const start = (page() - 1) * pageSize();
    return sortedData().slice(start, start + pageSize());
  });

  function setQuery(q: { search?: Record<string, any>; filter?: Record<string, any> }) {
    queryState.set({ search: q.search ?? {}, filter: q.filter ?? {} });
    page.set(1);
  }

  function setPage(p: number) {
    const clamped = Math.max(1, Math.min(p, totalPages()));
    page.set(clamped);
  }

  function setPageSize(s: number) {
    pageSize.set(Math.max(1, Math.floor(s || 10)));
    page.set(1);
  }

  function setSort(key: string | null, dir: SortDirection) {
    // enforce allowed sort keys if config provided
    const allowedSortKeys = (sortConfig || []).filter(s => s.sortable).map(s => s.key);
    if (key && allowedSortKeys.length && !allowedSortKeys.includes(key)) return;
    sortKey.set(key);
    sortDir.set(dir);
    page.set(1);
  }

  return {
    queryState,
    setQuery,
    page,
    pageSize,
    totalItems,
    totalPages,
    paginatedData,
    setPage,
    setPageSize,
    sortKey,
    sortDir,
    setSort,
    searchFields,
    filterFields,
    sortConfig,
  } as TableController<T>;
}
