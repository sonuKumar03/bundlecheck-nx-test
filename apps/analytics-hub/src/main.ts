import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDashboardComponent } from '@nx-workspace/feature-analytics';
import { UserSessionService } from '@nx-workspace/data-access-auth';

@Component({
  selector: 'app-analytics-root',
  standalone: true,
  imports: [CommonModule, AnalyticsDashboardComponent],
  template: `
    <div class="analytics-app">
      <header class="app-header">
        <h1>Executive Telemetry & BI Hub</h1>
        <div class="user-pill">
          <span>Logged in as: {{ session.currentUser()?.email }}</span>
        </div>
      </header>
      <main>
        <lib-feature-analytics></lib-feature-analytics>
      </main>
    </div>
  `,
  styles: [`
    .analytics-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: #f1f5f9;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #0f172a;
      color: #ffffff;
    }
    .app-header h1 {
      font-size: 1.25rem;
      margin: 0;
    }
    .user-pill {
      font-size: 0.8125rem;
      color: #94a3b8;
    }
    main {
      padding: 2rem;
    }
  `]
})
export class AnalyticsRootComponent {
  session = inject(UserSessionService);
}

bootstrapApplication(AnalyticsRootComponent).catch((err) => console.error(err));
