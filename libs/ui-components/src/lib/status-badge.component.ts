import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'lib-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + variant">
      <span class="badge-dot" *ngIf="showDot"></span>
      <span class="badge-text"><ng-content></ng-content>{{ label }}</span>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      line-height: 1.25;
      letter-spacing: 0.02em;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .badge-success {
      background: #dcfce7;
      color: #166534;
    }
    .badge-success .badge-dot {
      background: #22c55e;
    }
    .badge-warning {
      background: #fef9c3;
      color: #854d0e;
    }
    .badge-warning .badge-dot {
      background: #eab308;
    }
    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }
    .badge-danger .badge-dot {
      background: #ef4444;
    }
    .badge-info {
      background: #e0f2fe;
      color: #075985;
    }
    .badge-info .badge-dot {
      background: #0284c7;
    }
    .badge-neutral {
      background: #f1f5f9;
      color: #475569;
    }
    .badge-neutral .badge-dot {
      background: #94a3b8;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() label = '';
  @Input() showDot = true;
}
