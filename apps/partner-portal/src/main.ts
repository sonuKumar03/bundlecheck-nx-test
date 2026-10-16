import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from '@nx-workspace/feature-billing';
import { AuditLogsComponent } from '@nx-workspace/feature-audit-logs';
import { UserSessionService } from '@nx-workspace/data-access-auth';
import { AppSwitcherComponent, ToastContainerComponent } from '@nx-workspace/ui';

@Component({
  selector: 'app-partner-root',
  standalone: true,
  imports: [CommonModule, BillingComponent, AuditLogsComponent, AppSwitcherComponent, ToastContainerComponent],
  template: `
    <div class="partner-app">
      <header class="app-header">
        <div class="brand">
          <div class="brand-icon">🤝</div>
          <div class="brand-text">
            <h1>Partner Central</h1>
            <span class="sub">Self-Service Account, Invoicing & API Credentials</span>
          </div>
        </div>
        <div class="header-right">
          <span class="port-indicator">
            <span class="status-dot"></span> Serving on port 3002
          </span>
          <lib-app-switcher currentApp="partner"></lib-app-switcher>
          <div class="session-info">
            <span class="org-badge">{{ session.currentUser()?.organizationId || 'ORG-ENTERPRISE-891' }}</span>
          </div>
        </div>
      </header>

      <div class="partner-tabs">
        <button [class.active]="activeTab === 'billing'" (click)="activeTab = 'billing'">
          💳 Subscription & Billing
        </button>
        <button [class.active]="activeTab === 'audit'" (click)="activeTab = 'audit'">
          📜 Security & Audit Logs
        </button>
      </div>

      <main class="content">
        <lib-feature-billing *ngIf="activeTab === 'billing'"></lib-feature-billing>
        <lib-feature-audit-logs *ngIf="activeTab === 'audit'"></lib-feature-audit-logs>
      </main>

      <lib-toast-container></lib-toast-container>
    </div>
  `,
  styles: [`
    .partner-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: #f8fafc;
      color: #0f172a;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #1e1b4b;
      color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .brand-text h1 {
      font-size: 1.25rem;
      margin: 0;
      line-height: 1.2;
    }
    .brand-text .sub {
      font-size: 0.75rem;
      color: #c7d2fe;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .port-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #a5b4fc;
      font-weight: 600;
      font-size: 0.78rem;
      background: rgba(165, 180, 252, 0.15);
      border: 1px solid rgba(165, 180, 252, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      background-color: #818cf8;
      border-radius: 50%;
      box-shadow: 0 0 6px #818cf8;
    }
    .org-badge {
      font-size: 0.75rem;
      color: #e0e7ff;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.3rem 0.65rem;
      border-radius: 6px;
      font-weight: 600;
    }
    .partner-tabs {
      display: flex;
      gap: 0.5rem;
      padding: 0.85rem 2rem 0;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
    }
    .partner-tabs button {
      background: none;
      border: none;
      padding: 0.75rem 1.25rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: #64748b;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
    }
    .partner-tabs button:hover {
      color: #1e1b4b;
    }
    .partner-tabs button.active {
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }
    .content {
      padding: 2rem;
      max-width: 1300px;
      margin: 0 auto;
    }
  `]
})
export class PartnerRootComponent {
  session = inject(UserSessionService);
  activeTab: 'billing' | 'audit' = 'billing';
}

bootstrapApplication(PartnerRootComponent).catch((err) => console.error(err));
