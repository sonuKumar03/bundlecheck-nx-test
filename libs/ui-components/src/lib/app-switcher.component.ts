import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SuiteApp {
  id: 'portal' | 'admin' | 'analytics' | 'partner';
  name: string;
  sub: string;
  icon: string;
  color: string;
  port: number;
}

@Component({
  selector: 'lib-app-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="switcher-container">
      <button
        class="switcher-trigger"
        (click)="toggleMenu()"
        [class.open]="isOpen()"
        title="Enterprise App Suite Switcher"
      >
        <span class="grid-icon">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </span>
        <span class="trigger-label">App Suite</span>
      </button>

      <!-- Dropdown Backdrop -->
      <div class="backdrop" *ngIf="isOpen()" (click)="closeMenu()"></div>

      <!-- App Grid Popover -->
      <div class="switcher-popover" *ngIf="isOpen()">
        <div class="popover-header">
          <span class="header-title">Enterprise Suite Applications</span>
          <span class="workspace-badge">Nx Monorepo</span>
        </div>

        <div class="apps-grid">
          <a
            *ngFor="let app of apps"
            [href]="'http://localhost:' + app.port"
            class="app-card"
            [class.current]="app.id === currentApp"
            (click)="isOpen.set(false)"
          >
            <div class="app-icon-badge" [style.background]="app.color">
              {{ app.icon }}
            </div>
            <div class="app-info">
              <div class="app-name-row">
                <span class="app-name">{{ app.name }}</span>
                <span *ngIf="app.id === currentApp" class="current-pill">Current</span>
              </div>
              <span class="app-sub">{{ app.sub }}</span>
              <span class="app-port">localhost:{{ app.port }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .switcher-container {
      position: relative;
      display: inline-block;
    }
    .switcher-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #334155;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .switcher-trigger:hover, .switcher-trigger.open {
      background: #f8fafc;
      border-color: #94a3b8;
      color: #0f172a;
    }
    .grid-icon {
      display: grid;
      grid-template-columns: repeat(3, 3px);
      gap: 2px;
      width: 13px;
      height: 13px;
    }
    .grid-icon span {
      background-color: #475569;
      border-radius: 1px;
    }
    .trigger-label {
      font-size: 0.8125rem;
    }
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
    }
    .switcher-popover {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      width: 320px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
      z-index: 10000;
      overflow: hidden;
      animation: popover-in 0.15s ease-out;
    }
    @keyframes popover-in {
      from { transform: translateY(-4px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .popover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .header-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .workspace-badge {
      font-size: 0.7rem;
      color: #4f46e5;
      background: #e0e7ff;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .apps-grid {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .app-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .app-card:hover {
      background: #f1f5f9;
    }
    .app-card.current {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .app-icon-badge {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #ffffff;
      flex-shrink: 0;
    }
    .app-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .app-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .app-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
    }
    .current-pill {
      font-size: 0.65rem;
      background: #dcfce7;
      color: #15803d;
      padding: 0.1rem 0.35rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .app-sub {
      font-size: 0.75rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .app-port {
      font-size: 0.7rem;
      color: #94a3b8;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      margin-top: 0.1rem;
    }
  `]
})
export class AppSwitcherComponent {
  @Input() currentApp: 'portal' | 'admin' | 'analytics' | 'partner' = 'portal';
  isOpen = signal(false);

  apps: SuiteApp[] = [
    {
      id: 'portal',
      name: 'OmniReport Studio',
      sub: 'Documents, Sheets & 3D Reports',
      icon: '📊',
      color: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      port: 3000
    },
    {
      id: 'analytics',
      name: 'Analytics Hub',
      sub: 'Real-Time Telemetry & BI',
      icon: '⚡',
      color: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      port: 3001
    },
    {
      id: 'partner',
      name: 'Partner Central',
      sub: 'Billing, Invoices & API Keys',
      icon: '🤝',
      color: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
      port: 3002
    },
    {
      id: 'admin',
      name: 'Admin Dashboard',
      sub: 'Enterprise Control Plane & RBAC',
      icon: '🛡️',
      color: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
      port: 3003
    }
  ];

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
  }
}
