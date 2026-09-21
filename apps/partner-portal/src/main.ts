import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from '@nx-workspace/feature-billing';
import { AuditLogsComponent } from '@nx-workspace/feature-audit-logs';
import { UserSessionService } from '@nx-workspace/data-access-auth';

@Component({
  selector: 'app-partner-root',
  standalone: true,
  imports: [CommonModule, BillingComponent, AuditLogsComponent],
  template: `
    <div class="partner-app">
      <header class="app-header">
        <div class="brand">
          <h1>Partner Central</h1>
          <span class="sub">Self-Service Account & Compliance</span>
        </div>
        <div class="session-info">
          <span>Organization: {{ session.currentUser()?.organizationId }}</span>
        </div>
      </header>

      <div class="partner-tabs">
        <button [class.active]="activeTab === 'billing'" (click)="activeTab = 'billing'">
          Subscription & Billing
        </button>
        <button [class.active]="activeTab === 'audit'" (click)="activeTab = 'audit'">
          Security & Audit Logs
        </button>
      </div>

      <main class="content">
        <lib-feature-billing *ngIf="activeTab === 'billing'"></lib-feature-billing>
        <lib-feature-audit-logs *ngIf="activeTab === 'audit'"></lib-feature-audit-logs>
      </main>
    </div>
  `,
  styles: [`
    .partner-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: #f8fafc;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      background: #1e1b4b;
      color: #ffffff;
    }
    .brand h1 {
      font-size: 1.35rem;
      margin: 0;
    }
    .brand .sub {
      font-size: 0.8125rem;
      color: #a5b4fc;
    }
    .session-info {
      font-size: 0.875rem;
      color: #c7d2fe;
    }
    .partner-tabs {
      display: flex;
      gap: 0.5rem;
      padding: 1rem 2rem 0;
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
    }
    .partner-tabs button.active {
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }
    .content {
      padding: 2rem;
    }
  `]
})
export class PartnerRootComponent {
  session = inject(UserSessionService);
  activeTab: 'billing' | 'audit' = 'billing';
}

bootstrapApplication(PartnerRootComponent).catch((err) => console.error(err));
