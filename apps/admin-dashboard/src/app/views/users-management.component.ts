import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, AdminUser } from '../admin-data.service';
import { DataTableComponent, TableColumn } from '@nx-workspace/ui-data-table';
import { ToastService } from '@nx-workspace/ui';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  template: `
    <div class="view-container">
      <div class="view-header">
        <div class="header-titles">
          <h2>Enterprise Identity & User Directory</h2>
          <p class="subtitle">Manage enterprise accounts, roles, access status, and multi-factor authentication</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="exportUsers()">
            <span class="btn-icon">📥</span> Export Excel
          </button>
          <button class="btn btn-primary" (click)="openInviteModal()">
            <span class="btn-icon">+</span> Invite User
          </button>
        </div>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="user-kpis">
        <div class="kpi-box">
          <span class="kpi-title">Total Accounts</span>
          <span class="kpi-num">{{ dataService.users().length }}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-title">Active Directory</span>
          <span class="kpi-num text-success">{{ activeCount() }}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-title">Suspended</span>
          <span class="kpi-num text-danger">{{ suspendedCount() }}</span>
        </div>
        <div class="kpi-box">
          <span class="kpi-title">MFA Adoption</span>
          <span class="kpi-num text-info">{{ mfaAdoptionPct() }}%</span>
        </div>
      </div>

      <!-- Users Data Table -->
      <lib-data-table
        title="Enterprise Accounts Directory"
        [columns]="columns"
        [data]="dataService.users()"
      >
        <div table-actions class="table-custom-actions">
          <select [ngModel]="selectedRole()" (ngModelChange)="filterByRole($event)" class="role-select">
            <option value="">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Security Officer">Security Officer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Billing Partner">Billing Partner</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </lib-data-table>

      <!-- User Action Drawer / Row Manager -->
      <div class="manage-tray">
        <div class="tray-title">Quick Status Overrides</div>
        <div class="user-pills-list">
          <div *ngFor="let u of dataService.users()" class="user-chip-row">
            <div class="chip-info">
              <strong>{{ u.name }}</strong>
              <span>{{ u.email }} ({{ u.role }})</span>
            </div>
            <div class="chip-actions">
              <span class="status-indicator" [class.active]="u.status === 'active'">{{ u.status }}</span>
              <button
                class="btn-toggle"
                [class.btn-suspend]="u.status === 'active'"
                [class.btn-activate]="u.status === 'suspended'"
                (click)="toggleUserStatus(u)"
              >
                {{ u.status === 'active' ? 'Suspend' : 'Reactivate' }}
              </button>
            </div>
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
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header-titles h2 {
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
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
    }
    .btn-primary {
      background: #047857;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #065f46;
    }
    .btn-secondary {
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    }
    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .user-kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .kpi-box {
      background: #ffffff;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .kpi-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
    }
    .kpi-num {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }
    .text-success { color: #16a34a; }
    .text-danger { color: #dc2626; }
    .text-info { color: #0284c7; }
    .role-select {
      padding: 0.4rem 0.65rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.8125rem;
      color: #334155;
      background: #ffffff;
    }
    .manage-tray {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
    }
    .tray-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    .user-pills-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 0.75rem;
    }
    .user-chip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0.85rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    .chip-info {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
    }
    .chip-info strong {
      color: #0f172a;
    }
    .chip-info span {
      color: #64748b;
    }
    .chip-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .status-indicator {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: 9999px;
      background: #fee2e2;
      color: #991b1b;
      text-transform: capitalize;
    }
    .status-indicator.active {
      background: #dcfce7;
      color: #166534;
    }
    .btn-toggle {
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      border: none;
    }
    .btn-suspend {
      background: #fee2e2;
      color: #b91c1c;
    }
    .btn-suspend:hover {
      background: #fecaca;
    }
    .btn-activate {
      background: #dcfce7;
      color: #15803d;
    }
    .btn-activate:hover {
      background: #bbf7d0;
    }
  `]
})
export class UsersManagementComponent {
  dataService = inject(AdminDataService);
  toastService = inject(ToastService);

  selectedRole = signal('');

  columns: TableColumn[] = [
    { key: 'id', header: 'User ID', width: '100px', type: 'code' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', type: 'badge' },
    { key: 'department', header: 'Department' },
    { key: 'status', header: 'Status', type: 'badge' },
    { key: 'lastLogin', header: 'Last Login' }
  ];

  activeCount() {
    return this.dataService.users().filter(u => u.status === 'active').length;
  }

  suspendedCount() {
    return this.dataService.users().filter(u => u.status === 'suspended').length;
  }

  mfaAdoptionPct() {
    const total = this.dataService.users().length;
    const mfa = this.dataService.users().filter(u => u.mfaEnabled).length;
    return total > 0 ? Math.round((mfa / total) * 100) : 0;
  }

  filterByRole(role: string) {
    this.selectedRole.set(role);
  }

  toggleUserStatus(user: AdminUser) {
    this.dataService.toggleUserStatus(user.id);
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    this.toastService.info(
      `Account ${user.name} is now ${newStatus}.`,
      'Status Updated'
    );
  }

  async exportUsers() {
    try {
      await this.dataService.exportUsersToExcel();
      this.toastService.success('Enterprise users exported to Excel (.xlsx)', 'Export Succeeded');
    } catch {
      this.toastService.error('Failed to generate Excel file', 'Export Error');
    }
  }

  openInviteModal() {
    this.toastService.info('Invitation link generated and emailed.', 'Invite Sent');
  }
}
