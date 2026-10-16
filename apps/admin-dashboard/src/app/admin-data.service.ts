import { Injectable, signal } from '@angular/core';
import * as ExcelJS from 'exceljs';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Security Officer' | 'Data Analyst' | 'Billing Partner' | 'Viewer';
  department: string;
  status: 'active' | 'suspended';
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface RolePermissions {
  name: string;
  description: string;
  usersCount: number;
  read: boolean;
  write: boolean;
  delete: boolean;
  export: boolean;
  manageUsers: boolean;
}

export interface ClusterNode {
  id: string;
  name: string;
  type: string;
  cpuPct: number;
  memoryPct: number;
  pingMs: number;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPct: number;
  target: string;
  environment: 'production' | 'staging' | 'all';
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  readonly users = signal<AdminUser[]>([
    { id: 'usr_01', name: 'Elena Rostova', email: 'elena@enterprise.internal', role: 'Administrator', department: 'SecOps & Cloud', status: 'active', mfaEnabled: true, lastLogin: '2 mins ago' },
    { id: 'usr_02', name: 'Marcus Chen', email: 'mchen@enterprise.internal', role: 'Security Officer', department: 'InfraSec', status: 'active', mfaEnabled: true, lastLogin: '18 mins ago' },
    { id: 'usr_03', name: 'Sophia Sterling', email: 'ssterling@enterprise.internal', role: 'Data Analyst', department: 'Business Intelligence', status: 'active', mfaEnabled: true, lastLogin: '1 hour ago' },
    { id: 'usr_04', name: 'David Vance', email: 'dvance@enterprise.internal', role: 'Billing Partner', department: 'Finance & Compliance', status: 'active', mfaEnabled: false, lastLogin: 'Yesterday' },
    { id: 'usr_05', name: 'Amina Idris', email: 'aidris@enterprise.internal', role: 'Data Analyst', department: 'Analytics Core', status: 'active', mfaEnabled: true, lastLogin: '3 hours ago' },
    { id: 'usr_06', name: 'Liam O’Connor', email: 'loconnor@enterprise.internal', role: 'Administrator', department: 'Platform Engineering', status: 'active', mfaEnabled: true, lastLogin: 'Just now' },
    { id: 'usr_07', name: 'Hiroshi Tanaka', email: 'htanaka@enterprise.internal', role: 'Viewer', department: 'Executive Office', status: 'active', mfaEnabled: true, lastLogin: '2 days ago' },
    { id: 'usr_08', name: 'Rachel Zane', email: 'rzane@enterprise.internal', role: 'Viewer', department: 'Legal', status: 'suspended', mfaEnabled: false, lastLogin: '3 weeks ago' },
    { id: 'usr_09', name: 'Carlos Mendez', email: 'cmendez@enterprise.internal', role: 'Data Analyst', department: 'Risk Analytics', status: 'active', mfaEnabled: true, lastLogin: '4 hours ago' },
    { id: 'usr_10', name: 'Zoe Kravitz', email: 'zkravitz@enterprise.internal', role: 'Billing Partner', department: 'Accounts Receivable', status: 'active', mfaEnabled: true, lastLogin: '5 hours ago' }
  ]);

  readonly roles = signal<RolePermissions[]>([
    { name: 'Administrator', description: 'Full system authorization including tenant isolation and credential overrides', usersCount: 2, read: true, write: true, delete: true, export: true, manageUsers: true },
    { name: 'Security Officer', description: 'Audit policy definition, security trace monitoring, compliance reports', usersCount: 1, read: true, write: true, delete: false, export: true, manageUsers: false },
    { name: 'Data Analyst', description: 'Report builder access, dataset queries, charting exports, telemetry inspect', usersCount: 3, read: true, write: true, delete: false, export: true, manageUsers: false },
    { name: 'Billing Partner', description: 'Subscription upgrades, invoice ledger export, financial webhook access', usersCount: 2, read: true, write: true, delete: false, export: true, manageUsers: false },
    { name: 'Viewer', description: 'Read-only dashboard browsing and telemetry observer privileges', usersCount: 2, read: true, write: false, delete: false, export: false, manageUsers: false }
  ]);

  readonly nodes = signal<ClusterNode[]>([
    { id: 'node_gw_01', name: 'api-gateway-us-east-1', type: 'Envoy Edge Router', cpuPct: 34, memoryPct: 58, pingMs: 4, status: 'healthy', uptime: '99.99% (42d 12h)' },
    { id: 'node_redis_01', name: 'cache-redis-cluster-primary', type: 'Redis 7.2 In-Memory', cpuPct: 18, memoryPct: 76, pingMs: 1, status: 'healthy', uptime: '99.98% (60d 04h)' },
    { id: 'node_pg_01', name: 'db-aurora-postgres-writer', type: 'PostgreSQL 16.2 Enterprise', cpuPct: 62, memoryPct: 82, pingMs: 7, status: 'warning', uptime: '99.95% (18d 08h)' },
    { id: 'node_nx_01', name: 'nx-cloud-agent-runner-pool', type: 'Nx Distributed Task Runner', cpuPct: 88, memoryPct: 64, pingMs: 12, status: 'warning', uptime: '99.90% (7d 02h)' },
    { id: 'node_s3_01', name: 'storage-lake-s3-sync', type: 'Object Storage Gateway', cpuPct: 12, memoryPct: 32, pingMs: 15, status: 'healthy', uptime: '99.99% (120d 01h)' }
  ]);

  readonly featureFlags = signal<FeatureFlag[]>([
    { key: 'ff_threejs_renderer', name: 'Next-Gen 3D WebGL Engine', description: 'Activates client-side Three.js spatial viewport for telemetry matrices', enabled: true, rolloutPct: 100, target: 'Enterprise Tenants', environment: 'production' },
    { key: 'ff_vector_search', name: 'Semantic Document Indexing', description: 'Vector embeddings generation for PDF and spreadsheet document OCR', enabled: true, rolloutPct: 50, target: 'Beta Cohort', environment: 'staging' },
    { key: 'ff_realtime_metrics_ws', name: 'High-Frequency WebSocket Telemetry', description: 'Switches polling telemetry to duplex WebSocket stream at 60Hz', enabled: false, rolloutPct: 10, target: 'Internal Staff', environment: 'all' },
    { key: 'ff_audit_ledger_immutable', name: 'Cryptographic Audit Block Ledger', description: 'Enforces HMAC cryptographic hashing on all compliance mutation events', enabled: true, rolloutPct: 100, target: 'All Tenants', environment: 'production' },
    { key: 'ff_dark_mode_v2', name: 'Dynamic Contrast Dark Theme', description: 'Theme palette engine with accessibility tokens and custom gradients', enabled: false, rolloutPct: 0, target: 'Design Review', environment: 'staging' }
  ]);

  toggleUserStatus(id: string) {
    this.users.update(list =>
      list.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)
    );
  }

  togglePermission(roleName: string, perm: 'read' | 'write' | 'delete' | 'export' | 'manageUsers') {
    this.roles.update(list =>
      list.map(r => r.name === roleName ? { ...r, [perm]: !r[perm] } : r)
    );
  }

  toggleFeatureFlag(key: string) {
    this.featureFlags.update(list =>
      list.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f)
    );
  }

  updateRollout(key: string, pct: number) {
    this.featureFlags.update(list =>
      list.map(f => f.key === key ? { ...f, rolloutPct: Number(pct) } : f)
    );
  }

  restartNode(id: string) {
    this.nodes.update(list =>
      list.map(n => n.id === id ? { ...n, cpuPct: 12, memoryPct: 35, pingMs: 3, status: 'healthy' } : n)
    );
  }

  async exportUsersToExcel(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OmniReport Admin Control Plane';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Enterprise Users');
    sheet.columns = [
      { header: 'User ID', key: 'id', width: 14 },
      { header: 'Full Name', key: 'name', width: 22 },
      { header: 'Email Address', key: 'email', width: 30 },
      { header: 'Assigned Role', key: 'role', width: 20 },
      { header: 'Department', key: 'department', width: 22 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'MFA Active', key: 'mfaEnabled', width: 12 },
      { header: 'Last Login', key: 'lastLogin', width: 16 }
    ];

    for (const u of this.users()) {
      sheet.addRow(u);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise_users_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
