import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '@nx-workspace/data-access-auth';
import { DataTableComponent, TableColumn } from '@nx-workspace/ui-data-table';
import { maskString } from '@nx-workspace/util-crypto';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  ipAddress: string;
  severity: string;
}

@Component({
  selector: 'lib-feature-audit-logs',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="audit-logs-page">
      <div class="header">
        <h2>Enterprise Security & Audit Trail</h2>
        <span class="user-context">Current Session: {{ session.currentUser()?.name }}</span>
      </div>

      <lib-data-table
        title="Compliance Event Ledger (Last 24 Hours)"
        [columns]="columns"
        [data]="events">
      </lib-data-table>
    </div>
  `,
  styles: [`
    .audit-logs-page {
      padding: 1.5rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .user-context {
      font-size: 0.8125rem;
      color: #64748b;
    }
  `]
})
export class AuditLogsComponent {
  session = inject(UserSessionService);

  columns: TableColumn[] = [
    { key: 'id', header: 'Event ID', width: '120px' },
    { key: 'timestamp', header: 'Timestamp', width: '180px' },
    { key: 'actor', header: 'Actor' },
    { key: 'action', header: 'Action' },
    { key: 'ipAddress', header: 'Source IP' },
    { key: 'severity', header: 'Severity', width: '100px' }
  ];

  events: AuditEvent[] = [
    {
      id: 'EVT-9021',
      timestamp: '2026-09-22 01:15:30 UTC',
      actor: 'admin@omnireport.internal',
      action: 'SYSTEM_SETTINGS_UPDATE',
      ipAddress: maskString('192.168.1.105'),
      severity: 'INFO'
    },
    {
      id: 'EVT-9020',
      timestamp: '2026-09-22 00:45:12 UTC',
      actor: 'partner_service_token',
      action: 'BATCH_EXPORT_EXECUTE',
      ipAddress: maskString('10.0.4.22'),
      severity: 'MEDIUM'
    },
    {
      id: 'EVT-9019',
      timestamp: '2026-09-21 23:30:00 UTC',
      actor: 'analyst_03@partner.corp',
      action: 'ANALYTICS_REPORT_ACCESS',
      ipAddress: maskString('172.16.0.44'),
      severity: 'INFO'
    }
  ];
}
