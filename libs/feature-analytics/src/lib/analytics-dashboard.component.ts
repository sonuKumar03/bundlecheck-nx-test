import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { MetricsStreamService } from '@nx-workspace/data-access-metrics';
import { KpiCardComponent } from '@nx-workspace/ui-kpi-card';
import { formatBytes } from '@nx-workspace/util-formatting';
import { StatusBadgeComponent, ToastService } from '@nx-workspace/ui';

Chart.register(...registerables);

interface AnomalyEvent {
  id: string;
  time: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

interface EndpointMetric {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  rps: number;
  p95Latency: number;
  errorRate: number;
}

@Component({
  selector: 'lib-feature-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent, StatusBadgeComponent],
  template: `
    <div class="analytics-hub">
      <!-- Header Controls Bar -->
      <div class="control-banner">
        <div class="banner-title-group">
          <h2>Executive Telemetry & Real-Time BI Hub</h2>
          <span class="stream-pill" [class.streaming]="isStreaming()">
            <span class="stream-dot"></span>
            {{ isStreaming() ? 'Telemetry Stream Active' : 'Stream Paused' }}
          </span>
        </div>

        <div class="banner-actions">
          <div class="interval-picker">
            <label for="speed">Refresh:</label>
            <select id="speed" [ngModel]="intervalMs()" (ngModelChange)="setIntervalSpeed($event)">
              <option [value]="1000">1s (High Speed)</option>
              <option [value]="2000">2s (Balanced)</option>
              <option [value]="5000">5s (Eco)</option>
            </select>
          </div>

          <button class="btn btn-secondary" (click)="toggleStreaming()">
            {{ isStreaming() ? '⏸ Pause' : '▶ Resume' }}
          </button>

          <button class="btn btn-danger" (click)="triggerTrafficSurge()">
            ⚡ Inject Traffic Surge
          </button>
        </div>
      </div>

      <!-- Real-Time KPI Cards -->
      <div class="kpi-row">
        <lib-kpi-card
          label="Throughput"
          [value]="currentRps() + ' req/s'"
          icon="⚡"
          [change]="rpsChange()"
          subtext="Sliding real-time window">
        </lib-kpi-card>

        <lib-kpi-card
          label="Avg Latency"
          [value]="currentLatency() + ' ms'"
          icon="⏱️"
          [change]="latencyChange()"
          subtext="P99: 46.2ms">
        </lib-kpi-card>

        <lib-kpi-card
          label="Memory Usage"
          [value]="formatMemory(currentMemoryBytes())"
          icon="💾"
          [change]="1.8"
          subtext="Heap pool: 72% allocated">
        </lib-kpi-card>

        <lib-kpi-card
          label="Success Rate"
          [value]="successRate() + '%'"
          icon="🛡️"
          [change]="0.01"
          subtext="Zero SLA breaches">
        </lib-kpi-card>
      </div>

      <!-- Chart Visualizations Grid -->
      <div class="charts-grid">
        <div class="chart-card line-chart-card">
          <div class="chart-header">
            <div>
              <h3>Real-Time Ingestion Throughput & Latency Trend</h3>
              <span class="chart-sub">Sliding 15-interval buffer via Chart.js</span>
            </div>
            <span class="badge-tech">Chart.js Engine</span>
          </div>
          <div class="canvas-box">
            <canvas #lineChartCanvas></canvas>
          </div>
        </div>

        <div class="chart-card pie-chart-card">
          <div class="chart-header">
            <div>
              <h3>HTTP Status Code Ingestion</h3>
              <span class="chart-sub">Traffic status breakdown</span>
            </div>
          </div>
          <div class="canvas-box doughnut-box">
            <canvas #doughnutCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Bottom Split: Top Endpoints & Live Incident Stream -->
      <div class="telemetry-split">
        <div class="endpoints-card">
          <div class="card-title-bar">
            <h3>Top Active Endpoints</h3>
            <span class="tag-count">5 Monitored</span>
          </div>
          <table class="telemetry-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint Path</th>
                <th>RPS</th>
                <th>P95</th>
                <th>Error %</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ep of endpoints">
                <td><span [class]="'method-tag method-' + ep.method">{{ ep.method }}</span></td>
                <td><code class="ep-code">{{ ep.path }}</code></td>
                <td><strong>{{ ep.rps }}</strong></td>
                <td>{{ ep.p95Latency }}ms</td>
                <td><span [class.error-alert]="ep.errorRate > 1">{{ ep.errorRate }}%</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="incidents-card">
          <div class="card-title-bar">
            <h3>Live Ingestion Anomaly & Audit Feed</h3>
            <span class="live-dot">● Active</span>
          </div>
          <div class="incident-feed">
            <div *ngFor="let ev of anomalies()" class="incident-item">
              <div class="incident-meta">
                <span class="incident-time">{{ ev.time }}</span>
                <lib-status-badge [variant]="ev.severity" [label]="ev.type"></lib-status-badge>
              </div>
              <p class="incident-msg">{{ ev.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-hub {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .control-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 1.25rem 1.5rem;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .banner-title-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .banner-title-group h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .stream-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: #f1f5f9;
      color: #64748b;
    }
    .stream-pill.streaming {
      background: #dcfce7;
      color: #15803d;
    }
    .stream-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #94a3b8;
    }
    .stream-pill.streaming .stream-dot {
      background: #22c55e;
      box-shadow: 0 0 6px #22c55e;
    }
    .banner-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .interval-picker {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      color: #475569;
    }
    .interval-picker select {
      padding: 0.35rem 0.65rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.8125rem;
      background: #ffffff;
      color: #0f172a;
    }
    .btn {
      padding: 0.45rem 0.85rem;
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .btn-secondary {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: #334155;
    }
    .btn-secondary:hover {
      background: #f1f5f9;
    }
    .btn-danger {
      background: #fee2e2;
      border-color: #fca5a5;
      color: #b91c1c;
    }
    .btn-danger:hover {
      background: #fecaca;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
    .chart-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .chart-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }
    .chart-sub {
      font-size: 0.75rem;
      color: #64748b;
    }
    .badge-tech {
      font-size: 0.7rem;
      color: #4f46e5;
      background: #e0e7ff;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .canvas-box {
      position: relative;
      height: 260px;
      width: 100%;
    }
    .doughnut-box {
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .telemetry-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 900px) {
      .telemetry-split {
        grid-template-columns: 1fr;
      }
    }
    .endpoints-card, .incidents-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
    }
    .card-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card-title-bar h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }
    .tag-count {
      font-size: 0.72rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .live-dot {
      color: #16a34a;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .telemetry-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }
    .telemetry-table th {
      background: #f8fafc;
      padding: 0.6rem 0.75rem;
      font-weight: 600;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    .telemetry-table td {
      padding: 0.65rem 0.75rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .method-tag {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }
    .method-GET { background: #e0f2fe; color: #0284c7; }
    .method-POST { background: #dcfce7; color: #15803d; }
    .method-PUT { background: #fef9c3; color: #854d0e; }
    .method-DELETE { background: #fee2e2; color: #b91c1c; }
    .ep-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.75rem;
    }
    .error-alert {
      color: #dc2626;
      font-weight: 700;
    }
    .incident-feed {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 280px;
      overflow-y: auto;
    }
    .incident-item {
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .incident-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .incident-time {
      font-size: 0.7rem;
      color: #94a3b8;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .incident-msg {
      font-size: 0.8rem;
      color: #334155;
      margin: 0;
      line-height: 1.35;
    }
  `]
})
export class AnalyticsDashboardComponent implements AfterViewInit, OnDestroy {
  metricsService = inject(MetricsStreamService);
  toastService = inject(ToastService);

  @ViewChild('lineChartCanvas') lineCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutCanvas') doughnutCanvasRef!: ElementRef<HTMLCanvasElement>;

  private lineChart: Chart | null = null;
  private doughnutChart: Chart | null = null;
  private timerId: any = null;

  isStreaming = signal(true);
  intervalMs = signal(2000);

  currentRps = signal(745);
  rpsChange = signal(12.4);
  currentLatency = signal(22.6);
  latencyChange = signal(-6.2);
  currentMemoryBytes = signal(1380 * 1024 * 1024);
  successRate = signal(99.98);

  endpoints: EndpointMetric[] = [
    { path: '/api/v2/telemetry/stream', method: 'GET', rps: 340, p95Latency: 14.2, errorRate: 0.02 },
    { path: '/api/v2/reports/export', method: 'POST', rps: 185, p95Latency: 48.5, errorRate: 0.15 },
    { path: '/api/v2/datasets/sync', method: 'PUT', rps: 112, p95Latency: 28.0, errorRate: 0.08 },
    { path: '/api/v2/users/auth', method: 'POST', rps: 88, p95Latency: 16.5, errorRate: 0.01 },
    { path: '/api/v2/documents/ocr', method: 'POST', rps: 20, p95Latency: 92.4, errorRate: 1.25 }
  ];

  anomalies = signal<AnomalyEvent[]>([
    { id: '1', time: '10:42:15', type: 'ROUTING', message: 'Envoy edge router autoscaled to 4 replicas on traffic ramp', severity: 'info' },
    { id: '2', time: '10:38:02', type: 'LATENCY', message: 'PDF document OCR worker queue spike (P95 reached 92ms)', severity: 'warning' },
    { id: '3', time: '10:25:49', type: 'RECOVERY', message: 'Redis cluster cache memory compaction completed (saved 180MB)', severity: 'info' }
  ]);

  ngAfterViewInit() {
    this.initCharts();
    this.startStreaming();
  }

  ngOnDestroy() {
    this.stopStreaming();
    if (this.lineChart) this.lineChart.destroy();
    if (this.doughnutChart) this.doughnutChart.destroy();
  }

  formatMemory(bytes: number): string {
    return formatBytes(bytes);
  }

  private initCharts() {
    if (this.lineCanvasRef?.nativeElement) {
      const initialLabels = ['-14m', '-13m', '-12m', '-11m', '-10m', '-9m', '-8m', '-7m', '-6m', '-5m', '-4m', '-3m', '-2m', '-1m', 'now'];
      const initialRps = [680, 710, 725, 690, 740, 730, 715, 760, 780, 750, 720, 740, 735, 755, 745];
      const initialLatency = [28, 25, 24, 26, 23, 25, 24, 22, 21, 23, 24, 23, 22, 23, 22.6];

      this.lineChart = new Chart(this.lineCanvasRef.nativeElement, {
        type: 'line',
        data: {
          labels: initialLabels,
          datasets: [
            {
              label: 'Throughput (req/s)',
              data: initialRps,
              borderColor: '#4f46e5',
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              yAxisID: 'y'
            },
            {
              label: 'Latency (ms)',
              data: initialLatency,
              borderColor: '#06b6d4',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.3,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'req/s', font: { size: 10 } }
            },
            y1: {
              type: 'linear',
              position: 'right',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'ms', font: { size: 10 } }
            }
          }
        }
      });
    }

    if (this.doughnutCanvasRef?.nativeElement) {
      this.doughnutChart = new Chart(this.doughnutCanvasRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['200 OK', '304 Cache', '4xx Client', '5xx Server'],
          datasets: [
            {
              data: [94.2, 4.1, 1.5, 0.2],
              backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }

  private startStreaming() {
    this.stopStreaming();
    this.timerId = setInterval(() => {
      if (!this.isStreaming()) return;
      this.tickTelemetry();
    }, this.intervalMs());
  }

  private stopStreaming() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private tickTelemetry() {
    const jitterRps = Math.round(720 + Math.random() * 60);
    const jitterLatency = Number((21 + Math.random() * 4).toFixed(1));

    this.currentRps.set(jitterRps);
    this.currentLatency.set(jitterLatency);

    if (this.lineChart) {
      const rpsData = this.lineChart.data.datasets[0].data as number[];
      const latencyData = this.lineChart.data.datasets[1].data as number[];

      rpsData.shift();
      rpsData.push(jitterRps);

      latencyData.shift();
      latencyData.push(jitterLatency);

      this.lineChart.update('none');
    }
  }

  toggleStreaming() {
    const next = !this.isStreaming();
    this.isStreaming.set(next);
    this.toastService.info(
      next ? 'Live telemetry ingestion resumed.' : 'Live stream paused.',
      'Telemetry Stream'
    );
  }

  setIntervalSpeed(speed: number) {
    this.intervalMs.set(Number(speed));
    this.startStreaming();
  }

  triggerTrafficSurge() {
    this.currentRps.set(1850);
    this.currentLatency.set(118.4);
    this.rpsChange.set(148.5);
    this.latencyChange.set(420.0);

    const nowStr = new Date().toTimeString().slice(0, 8);
    this.anomalies.update(list => [
      {
        id: String(Date.now()),
        time: nowStr,
        type: 'SURGE_SPIKE',
        message: 'Sudden +148% traffic surge detected on /api/v2/telemetry. Envoy circuit breaker armed.',
        severity: 'danger'
      },
      ...list.slice(0, 8)
    ]);

    if (this.lineChart) {
      const rpsData = this.lineChart.data.datasets[0].data as number[];
      const latencyData = this.lineChart.data.datasets[1].data as number[];
      rpsData.shift();
      rpsData.push(1850);
      latencyData.shift();
      latencyData.push(118.4);
      this.lineChart.update();
    }

    this.toastService.warning(
      'Traffic surge injected: 1,850 req/s. Circuit breaker threshold reached.',
      'Synthetic Traffic Alert'
    );
  }
}
