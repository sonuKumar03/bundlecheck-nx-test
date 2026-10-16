import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'code' | 'currency' | 'date';
}

@Component({
  selector: 'lib-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-shell">
      <div class="table-header-bar">
        <div class="header-left">
          <h3 class="table-title" *ngIf="title">{{ title }}</h3>
          <span class="row-count">
            {{ filteredData().length }} {{ filteredData().length === 1 ? 'entry' : 'entries' }}
            <span *ngIf="searchTerm()" class="filter-indicator">(filtered from {{ rawData().length }})</span>
          </span>
        </div>

        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search in table..."
              [ngModel]="searchTerm()"
              (ngModelChange)="onSearchChange($event)"
              class="search-input"
            />
            <button *ngIf="searchTerm()" (click)="clearSearch()" class="btn-clear" title="Clear search">×</button>
          </div>
          <ng-content select="[table-actions]"></ng-content>
        </div>
      </div>

      <div class="table-scroll">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th
                *ngFor="let col of columns"
                [style.width]="col.width || 'auto'"
                [class.sortable]="col.sortable !== false"
                (click)="toggleSort(col.key, col.sortable !== false)"
              >
                <div class="th-content">
                  <span>{{ col.header }}</span>
                  <span *ngIf="col.sortable !== false" class="sort-icon">
                    <ng-container *ngIf="sortKey() === col.key; else unsorted">
                      {{ sortDirection() === 'asc' ? '▲' : '▼' }}
                    </ng-container>
                    <ng-template #unsorted>
                      <span class="sort-idle">⇅</span>
                    </ng-template>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of paginatedData()">
              <td *ngFor="let col of columns">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'code'" class="cell-code">
                    {{ row[col.key] }}
                  </span>
                  <span *ngSwitchCase="'badge'" class="cell-badge" [class]="'badge-' + (row[col.key] || '').toLowerCase()">
                    {{ row[col.key] }}
                  </span>
                  <span *ngSwitchDefault>
                    {{ row[col.key] }}
                  </span>
                </ng-container>
              </td>
            </tr>
            <tr *ngIf="paginatedData().length === 0">
              <td [attr.colspan]="columns.length" class="empty-cell">
                <div class="empty-state">
                  <span class="empty-icon">📭</span>
                  <p class="empty-title">No matching records found</p>
                  <p class="empty-subtitle" *ngIf="searchTerm()">Try adjusting your search query</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="table-pagination-bar" *ngIf="filteredData().length > 0">
        <div class="pagination-info">
          Showing {{ paginationStart() + 1 }} to {{ paginationEnd() }} of {{ filteredData().length }} entries
        </div>

        <div class="pagination-controls">
          <div class="page-size-selector">
            <label for="pageSize">Rows per page:</label>
            <select
              id="pageSize"
              [ngModel]="pageSize()"
              (ngModelChange)="onPageSizeChange($event)"
              class="page-select"
            >
              <option [value]="5">5</option>
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
            </select>
          </div>

          <div class="page-buttons">
            <button
              class="page-btn"
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
              title="Previous Page"
            >
              ‹
            </button>
            <span class="page-indicator">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button
              class="page-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)"
              title="Next Page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-shell {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .table-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .header-left {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }
    .table-title {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .row-count {
      font-size: 0.8125rem;
      color: #64748b;
      font-weight: 500;
    }
    .filter-indicator {
      color: #3b82f6;
      font-weight: 600;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 0.65rem;
      font-size: 0.8rem;
      color: #94a3b8;
      pointer-events: none;
    }
    .search-input {
      padding: 0.45rem 1.75rem 0.45rem 2rem;
      font-size: 0.8125rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #0f172a;
      outline: none;
      width: 210px;
      transition: all 0.15s ease-in-out;
    }
    .search-input:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
      width: 250px;
    }
    .btn-clear {
      position: absolute;
      right: 0.5rem;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      line-height: 1;
    }
    .btn-clear:hover {
      color: #475569;
    }
    .table-scroll {
      overflow-x: auto;
    }
    .enterprise-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    .enterprise-table th {
      background: #f8fafc;
      padding: 0.75rem 1.25rem;
      font-weight: 600;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      user-select: none;
    }
    .enterprise-table th.sortable {
      cursor: pointer;
    }
    .enterprise-table th.sortable:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .th-content {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .sort-icon {
      font-size: 0.7rem;
      color: #4f46e5;
    }
    .sort-idle {
      color: #cbd5e1;
    }
    .enterprise-table td {
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      vertical-align: middle;
    }
    .enterprise-table tbody tr:hover {
      background-color: #f8fafc;
    }
    .cell-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8rem;
      background: #f1f5f9;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      color: #0f172a;
    }
    .cell-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      text-transform: capitalize;
    }
    .badge-active, .badge-healthy, .badge-low, .badge-paid {
      background: #dcfce7;
      color: #15803d;
    }
    .badge-warning, .badge-medium, .badge-pending {
      background: #fef9c3;
      color: #a16207;
    }
    .badge-critical, .badge-suspended, .badge-high, .badge-failed {
      background: #fee2e2;
      color: #b91c1c;
    }
    .badge-info {
      background: #e0f2fe;
      color: #0369a1;
    }
    .empty-cell {
      text-align: center;
      padding: 3rem 1.5rem !important;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .empty-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .empty-title {
      font-weight: 600;
      color: #475569;
      margin: 0;
    }
    .empty-subtitle {
      font-size: 0.8125rem;
      color: #94a3b8;
      margin: 0.25rem 0 0;
    }
    .table-pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      font-size: 0.8125rem;
      color: #64748b;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .page-select {
      padding: 0.25rem 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 0.8125rem;
      color: #334155;
      background: #ffffff;
    }
    .page-buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .page-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      color: #334155;
      line-height: 1;
      transition: background 0.15s;
    }
    .page-btn:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .page-indicator {
      font-size: 0.8125rem;
      color: #475569;
    }
  `]
})
export class DataTableComponent {
  @Input() title = '';
  @Input() columns: TableColumn[] = [];

  rawData = signal<any[]>([]);
  @Input() set data(val: any[]) {
    this.rawData.set(val || []);
  }

  searchTerm = signal('');
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);

  filteredData = computed(() => {
    let rows = [...this.rawData()];
    const query = this.searchTerm().trim().toLowerCase();

    if (query) {
      rows = rows.filter(row =>
        this.columns.some(col => {
          const val = row[col.key];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(query);
        })
      );
    }

    const key = this.sortKey();
    if (key) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    return rows;
  });

  totalPages = computed(() => {
    const total = this.filteredData().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  paginationStart = computed(() => {
    return (this.currentPage() - 1) * this.pageSize();
  });

  paginationEnd = computed(() => {
    return Math.min(this.paginationStart() + this.pageSize(), this.filteredData().length);
  });

  paginatedData = computed(() => {
    const start = this.paginationStart();
    const end = start + this.pageSize();
    return this.filteredData().slice(start, end);
  });

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  toggleSort(key: string, sortable: boolean) {
    if (!sortable) return;
    if (this.sortKey() === key) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else {
        this.sortKey.set(null);
        this.sortDirection.set('asc');
      }
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
