import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppSwitcherComponent, ToastContainerComponent } from '@nx-workspace/ui';

@Component({
  selector: 'app-admin-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AppSwitcherComponent, ToastContainerComponent],
  template: `
    <div class="admin-shell">
      <!-- Top Navbar -->
      <header class="admin-header">
        <div class="brand">
          <div class="logo-badge">🛡️</div>
          <div class="brand-text">
            <h1 class="brand-title">OmniAdmin Control Plane</h1>
            <span class="brand-sub">Enterprise Governance & Infrastructure Core</span>
          </div>
        </div>

        <div class="header-right">
          <span class="port-indicator">
            <span class="status-dot"></span> Serving on port 3003
          </span>
          <span class="env-pill">PRODUCTION · US-EAST</span>
          <lib-app-switcher currentApp="admin"></lib-app-switcher>
          <div class="admin-profile">
            <span class="avatar">👨‍💼</span>
            <div class="profile-info">
              <span class="name">Elena Rostova</span>
              <span class="role">Root Admin</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Layout Body -->
      <div class="admin-body">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <div class="nav-section">
            <span class="nav-heading">SECURITY & IDENTITY</span>
            <a routerLink="/users" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-text">Users Directory</span>
            </a>
            <a routerLink="/roles" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🛡️</span>
              <span class="nav-text">RBAC Permissions</span>
            </a>
            <a routerLink="/audit" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📜</span>
              <span class="nav-text">Compliance Audit</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-heading">INFRASTRUCTURE & OPS</span>
            <a routerLink="/system" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🖥️</span>
              <span class="nav-text">Cluster Topology</span>
            </a>
            <a routerLink="/flags" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🚩</span>
              <span class="nav-text">Feature Flags</span>
            </a>
          </div>

          <div class="sidebar-bottom">
            <div class="system-status-card">
              <div class="status-top">
                <span class="dot-live"></span>
                <span>Cluster Nominal</span>
              </div>
              <span class="status-sub">5/5 Nodes Active · Zero 5xx</span>
            </div>
          </div>
        </aside>

        <!-- Main Viewport -->
        <main class="admin-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <lib-toast-container></lib-toast-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
    }
    * {
      box-sizing: border-box;
    }
    .admin-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .admin-header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.5rem;
      flex-shrink: 0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .logo-badge {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #047857 0%, #10b981 100%);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 2px 4px rgba(4, 120, 87, 0.25);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 500;
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
      color: #047857;
      font-weight: 600;
      font-size: 0.8rem;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 6px #34d399;
    }
    .env-pill {
      font-size: 0.75rem;
      font-weight: 600;
      color: #0369a1;
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
    }
    .admin-profile {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-left: 0.75rem;
      border-left: 1px solid #e2e8f0;
    }
    .avatar {
      font-size: 1.25rem;
    }
    .profile-info {
      display: flex;
      flex-direction: column;
    }
    .profile-info .name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0f172a;
    }
    .profile-info .role {
      font-size: 0.7rem;
      color: #64748b;
    }
    .admin-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .admin-sidebar {
      width: 250px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      padding: 1.25rem 0.75rem;
      justify-content: space-between;
    }
    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
    }
    .nav-heading {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.06em;
      padding: 0 0.75rem 0.4rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.55rem 0.75rem;
      border-radius: 6px;
      text-decoration: none;
      color: #475569;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .nav-item:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .nav-item.active {
      background: #ecfdf5;
      color: #065f46;
      font-weight: 600;
    }
    .nav-icon {
      font-size: 1rem;
    }
    .sidebar-bottom {
      padding: 0.5rem;
    }
    .system-status-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .status-top {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0f172a;
    }
    .dot-live {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
    }
    .status-sub {
      font-size: 0.72rem;
      color: #64748b;
    }
    .admin-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: #f8fafc;
    }
  `]
})
export class AdminAppComponent {}
