import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsStreamService, PerformanceMetric } from '@nx-workspace/data-access-metrics';
import { KpiCardComponent } from '@nx-workspace/ui-kpi-card';
import { formatBytes } from '@nx-workspace/util-formatting';

@Component({
  selector: 'lib-feature-analytics',
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  template: `
    <div class="analytics-hub">
      <div class="header">
        <h2>Real-Time Telemetry & System Analytics</h2>
        <span class="live-indicator">● Streaming Live</span>
      </div>

      <div class="kpi-row">
        <lib-kpi-card
          label="Throughput"
          value="724 req/s"
          icon="⚡"
          [change]="14.2"
          subtext="Compared to last hour">
        </lib-kpi-card>

        <lib-kpi-card
          label="Avg Latency"
          value="24.8 ms"
          icon="⏱️"
          [change]="-8.5"
          subtext="P99: 48ms">
        </lib-kpi-card>

        <lib-kpi-card
          label="Memory Usage"
          [value]="formatMemory(1248 * 1024 * 1024)"
          icon="💾"
          [change]="2.1"
          subtext="Cluster capacity: 68%">
        </lib-kpi-card>

        <lib-kpi-card
          label="Success Rate"
          value="99.98%"
          icon="🛡️"
          [change]="0.01"
          subtext="Zero 5xx in window">
        </lib-kpi-card>
      </div>
    </div>
  `,
  styles: [`
    .analytics-hub {
      padding: 1.5rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .live-indicator {
      color: #16a34a;
      font-weight: 600;
      font-size: 0.8125rem;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
  `]
})
export class AnalyticsDashboardComponent {
  metricsService = inject(MetricsStreamService);

  formatMemory(bytes: number): string {
    return formatBytes(bytes);
  }
}
