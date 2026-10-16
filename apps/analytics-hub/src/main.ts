import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDashboardComponent } from '@nx-workspace/feature-analytics';
import { UserSessionService } from '@nx-workspace/data-access-auth';
import { AppSwitcherComponent, ToastContainerComponent } from '@nx-workspace/ui';

@Component({
  selector: 'app-analytics-root',
  standalone: true,
  imports: [CommonModule, AnalyticsDashboardComponent, AppSwitcherComponent, ToastContainerComponent],
  template: `
    <div class="analytics-app">
      <header class="app-header">
        <div class="brand">
          <div class="brand-icon">⚡</div>
          <div class="brand-text">
            <h1>Executive Telemetry & BI Hub</h1>
            <span class="sub">Streaming Ingestion & Load Analytics</span>
          </div>
        </div>
        <div class="header-actions">
          <span class="port-indicator">
            <span class="status-dot"></span> Serving on port 3001
          </span>
          <lib-app-switcher currentApp="analytics"></lib-app-switcher>
          <div class="user-pill">
            <span class="avatar">👤</span>
            <span>{{ session.currentUser()?.email || 'admin@telemetry.io' }}</span>
          </div>
        </div>
      </header>
      <main class="content">
        <lib-feature-analytics></lib-feature-analytics>
      </main>
      <lib-toast-container></lib-toast-container>
    </div>
  `,
  styles: [`
    .analytics-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: #f8fafc;
      color: #0f172a;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 2rem;
      background: #0f172a;
      color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
    }
    .brand-text h1 {
      font-size: 1.15rem;
      margin: 0;
      color: #ffffff;
      line-height: 1.2;
    }
    .brand-text .sub {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .port-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #38bdf8;
      font-weight: 600;
      font-size: 0.78rem;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      background-color: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 6px #38bdf8;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.08);
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
    }
    .content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class AnalyticsRootComponent {
  session = inject(UserSessionService);
}

bootstrapApplication(AnalyticsRootComponent).catch((err) => console.error(err));
