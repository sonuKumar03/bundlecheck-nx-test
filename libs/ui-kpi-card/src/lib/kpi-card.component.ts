import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label">{{ label }}</span>
        <span *ngIf="icon" class="kpi-icon">{{ icon }}</span>
      </div>
      <div class="kpi-main">
        <span class="kpi-value">{{ value }}</span>
        <span *ngIf="change !== undefined" [class]="'badge ' + (change >= 0 ? 'badge-pos' : 'badge-neg')">
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
      </div>
      <div class="kpi-subtext" *ngIf="subtext">
        {{ subtext }}
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .kpi-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kpi-icon {
      font-size: 1.125rem;
    }
    .kpi-main {
      display: flex;
      align-items: baseline;
      gap: 0.625rem;
    }
    .kpi-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }
    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
    }
    .badge-pos {
      background: #dcfce7;
      color: #166534;
    }
    .badge-neg {
      background: #fee2e2;
      color: #991b1b;
    }
    .kpi-subtext {
      margin-top: 0.375rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }
  `]
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon = '';
  @Input() change?: number;
  @Input() subtext = '';
}
