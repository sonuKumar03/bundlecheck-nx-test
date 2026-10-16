import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'lib-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-viewport">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast-item"
        [class]="'toast-' + toast.type"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
          <span *ngIf="toast.type === 'warning'">⚠</span>
          <span *ngIf="toast.type === 'error'">✕</span>
        </div>
        <div class="toast-content">
          <div class="toast-title" *ngIf="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="toastService.dismiss(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-viewport {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      max-width: 380px;
      pointer-events: none;
    }
    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      pointer-events: auto;
      animation: toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes toast-in {
      from { transform: translateY(16px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .toast-success {
      border-left-color: #22c55e;
    }
    .toast-success .toast-icon {
      color: #16a34a;
      background: #dcfce7;
    }
    .toast-info {
      border-left-color: #3b82f6;
    }
    .toast-info .toast-icon {
      color: #2563eb;
      background: #dbeafe;
    }
    .toast-warning {
      border-left-color: #eab308;
    }
    .toast-warning .toast-icon {
      color: #ca8a04;
      background: #fef9c3;
    }
    .toast-error {
      border-left-color: #ef4444;
    }
    .toast-error .toast-icon {
      color: #dc2626;
      background: #fee2e2;
    }
    .toast-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .toast-content {
      flex: 1;
    }
    .toast-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.15rem;
    }
    .toast-message {
      font-size: 0.8rem;
      color: #475569;
      line-height: 1.35;
    }
    .toast-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.15rem;
      line-height: 1;
      padding: 0;
    }
    .toast-close:hover {
      color: #0f172a;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
