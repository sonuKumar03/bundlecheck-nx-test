import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

@Component({
  selector: 'lib-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-shell">
      <div class="table-header-bar" *ngIf="title">
        <h3 class="table-title">{{ title }}</h3>
        <span class="row-count">{{ data.length }} entries</span>
      </div>
      <div class="table-scroll">
        <table class="enterprise-table">
          <thead>
            <tr>
              <th *ngFor="let col of columns" [style.width]="col.width || 'auto'">
                {{ col.header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data">
              <td *ngFor="let col of columns">
                {{ row[col.key] }}
              </td>
            </tr>
            <tr *ngIf="data.length === 0">
              <td [attr.colspan]="columns.length" class="empty-cell">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table-shell {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      background: #ffffff;
    }
    .table-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .table-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    .row-count {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
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
    }
    .enterprise-table td {
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .empty-cell {
      text-align: center;
      color: #94a3b8;
      padding: 2rem !important;
    }
  `]
})
export class DataTableComponent {
  @Input() title = '';
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
}
