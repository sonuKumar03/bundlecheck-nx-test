import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, ClusterNode } from '../admin-data.service';
import { StatusBadgeComponent, ToastService } from '@nx-workspace/ui';

@Component({
  selector: 'app-cluster-health',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2>Distributed Topology & Cluster Telemetry</h2>
          <p class="subtitle">Monitors edge routers, database clusters, Redis caches, and Nx build distributed nodes</p>
        </div>
        <div class="header-status">
          <lib-status-badge variant="success" label="99.98% Global Uptime"></lib-status-badge>
        </div>
      </div>

      <!-- Cluster Overview Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="card-label">Active Node Pool</span>
          <span class="card-val">{{ dataService.nodes().length }} Nodes</span>
          <span class="card-sub">Region: us-east-1 (Multi-AZ)</span>
        </div>
        <div class="metric-card">
          <span class="card-label">Avg P99 Network Ping</span>
          <span class="card-val text-success">5.8 ms</span>
          <span class="card-sub">Intra-VPC wire latency</span>
        </div>
        <div class="metric-card">
          <span class="card-label">Aggregate CPU Load</span>
          <span class="card-val">44.8%</span>
          <span class="card-sub">Autoscaling threshold: 80%</span>
        </div>
        <div class="metric-card">
          <span class="card-label">Bundle Storage Cache</span>
          <span class="card-val text-info">94.2% Hit Rate</span>
          <span class="card-sub">Nx remote distributed cache</span>
        </div>
      </div>

      <!-- Node Health Cards -->
      <div class="nodes-list">
        <div *ngFor="let node of dataService.nodes()" class="node-card" [class]="'border-' + node.status">
          <div class="node-header">
            <div class="node-title-box">
              <span class="node-name">{{ node.name }}</span>
              <span class="node-type">{{ node.type }}</span>
            </div>
            <lib-status-badge
              [variant]="node.status === 'healthy' ? 'success' : node.status === 'warning' ? 'warning' : 'danger'"
              [label]="node.status"
            ></lib-status-badge>
          </div>

          <div class="node-bars">
            <div class="bar-group">
              <div class="bar-labels">
                <span>CPU Utilization</span>
                <strong>{{ node.cpuPct }}%</strong>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  [style.width.%]="node.cpuPct"
                  [class.fill-warn]="node.cpuPct > 60"
                  [class.fill-danger]="node.cpuPct > 85"
                ></div>
              </div>
            </div>

            <div class="bar-group">
              <div class="bar-labels">
                <span>Memory Footprint</span>
                <strong>{{ node.memoryPct }}%</strong>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  [style.width.%]="node.memoryPct"
                  [class.fill-warn]="node.memoryPct > 70"
                  [class.fill-danger]="node.memoryPct > 90"
                ></div>
              </div>
            </div>
          </div>

          <div class="node-footer">
            <div class="meta-item">
              <span class="meta-key">Latency:</span>
              <span class="meta-val">{{ node.pingMs }}ms</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Uptime:</span>
              <span class="meta-val">{{ node.uptime }}</span>
            </div>
            <button class="btn-restart" (click)="restartNode(node)">
              Graceful Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .view-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0.25rem 0 0;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .metric-card {
      background: #ffffff;
      padding: 1.25rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .card-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
    }
    .card-val {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }
    .card-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .text-success { color: #16a34a; }
    .text-info { color: #0284c7; }
    .nodes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .node-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }
    .border-warning {
      border-left: 4px solid #eab308;
    }
    .border-critical {
      border-left: 4px solid #ef4444;
    }
    .border-healthy {
      border-left: 4px solid #22c55e;
    }
    .node-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }
    .node-title-box {
      display: flex;
      flex-direction: column;
    }
    .node-name {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .node-type {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .node-bars {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .bar-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: #475569;
      margin-bottom: 0.4rem;
    }
    .progress-track {
      height: 8px;
      background: #f1f5f9;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #10b981;
      border-radius: 9999px;
      transition: width 0.4s ease;
    }
    .fill-warn {
      background: #f59e0b;
    }
    .fill-danger {
      background: #ef4444;
    }
    .node-footer {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
      font-size: 0.8125rem;
      flex-wrap: wrap;
    }
    .meta-key {
      color: #94a3b8;
      margin-right: 0.35rem;
    }
    .meta-val {
      font-weight: 600;
      color: #334155;
    }
    .btn-restart {
      margin-left: auto;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-restart:hover {
      background: #fee2e2;
      color: #b91c1c;
      border-color: #fca5a5;
    }
  `]
})
export class ClusterHealthComponent {
  dataService = inject(AdminDataService);
  toastService = inject(ToastService);

  restartNode(node: ClusterNode) {
    this.dataService.restartNode(node.id);
    this.toastService.success(
      `Node ${node.name} initiated zero-downtime rolling reload.`,
      'Rolling Restart'
    );
  }
}
