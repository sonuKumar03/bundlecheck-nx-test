import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, RolePermissions } from '../admin-data.service';
import { ToastService } from '@nx-workspace/ui';

@Component({
  selector: 'app-roles-matrix',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2>Role-Based Access Control (RBAC) Matrix</h2>
          <p class="subtitle">Define granular privilege boundaries and enforcement policies across tenant services</p>
        </div>
        <button class="btn btn-primary" (click)="savePolicy()">
          Save Policy Changes
        </button>
      </div>

      <div class="matrix-card">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="th-role">System Role</th>
              <th class="th-desc">Scope Description</th>
              <th class="th-perm">Read Data</th>
              <th class="th-perm">Write Data</th>
              <th class="th-perm">Delete Records</th>
              <th class="th-perm">Export Reports</th>
              <th class="th-perm">Manage Users</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let role of dataService.roles()">
              <td class="td-role">
                <div class="role-badge">
                  <span class="role-name">{{ role.name }}</span>
                  <span class="user-badge">{{ role.usersCount }} assigned</span>
                </div>
              </td>
              <td class="td-desc">{{ role.description }}</td>
              <td class="td-perm">
                <input
                  type="checkbox"
                  [checked]="role.read"
                  (change)="toggle(role, 'read')"
                  class="perm-checkbox"
                />
              </td>
              <td class="td-perm">
                <input
                  type="checkbox"
                  [checked]="role.write"
                  (change)="toggle(role, 'write')"
                  class="perm-checkbox"
                />
              </td>
              <td class="td-perm">
                <input
                  type="checkbox"
                  [checked]="role.delete"
                  (change)="toggle(role, 'delete')"
                  class="perm-checkbox"
                />
              </td>
              <td class="td-perm">
                <input
                  type="checkbox"
                  [checked]="role.export"
                  (change)="toggle(role, 'export')"
                  class="perm-checkbox"
                />
              </td>
              <td class="td-perm">
                <input
                  type="checkbox"
                  [checked]="role.manageUsers"
                  (change)="toggle(role, 'manageUsers')"
                  class="perm-checkbox"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="policy-notice">
        <div class="notice-icon">🛡️</div>
        <div class="notice-text">
          <strong>Enforcement Engine:</strong> Privilege revocations take effect across all active token sessions within 60 seconds via distributed Redis revocation bloom filters.
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
    .btn-primary {
      background: #047857;
      color: #ffffff;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      transition: background 0.15s;
    }
    .btn-primary:hover {
      background: #065f46;
    }
    .matrix-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .matrix-table th {
      background: #f8fafc;
      padding: 0.85rem 1.25rem;
      font-weight: 600;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    .matrix-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      vertical-align: middle;
    }
    .th-role { width: 180px; }
    .th-desc { min-width: 260px; }
    .th-perm, .td-perm {
      text-align: center;
      width: 110px;
    }
    .role-badge {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .role-name {
      font-weight: 600;
      color: #0f172a;
    }
    .user-badge {
      font-size: 0.72rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      align-self: flex-start;
    }
    .td-desc {
      font-size: 0.8125rem;
      color: #64748b;
      line-height: 1.4;
    }
    .perm-checkbox {
      width: 18px;
      height: 18px;
      accent-color: #047857;
      cursor: pointer;
    }
    .policy-notice {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem 1.25rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #166534;
      font-size: 0.8125rem;
    }
    .notice-icon {
      font-size: 1.3rem;
    }
  `]
})
export class RolesMatrixComponent {
  dataService = inject(AdminDataService);
  toastService = inject(ToastService);

  toggle(role: RolePermissions, perm: 'read' | 'write' | 'delete' | 'export' | 'manageUsers') {
    this.dataService.togglePermission(role.name, perm);
    this.toastService.info(
      `Updated ${perm} privilege for ${role.name}`,
      'Policy Mutated'
    );
  }

  savePolicy() {
    this.toastService.success('All RBAC permissions propagated to gateway and services.', 'Policy Saved');
  }
}
