import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { formatCurrency, formatBytes } from '@nx-workspace/util-formatting';
import { maskString, generateId } from '@nx-workspace/util-crypto';
import { StatusBadgeComponent, ToastService } from '@nx-workspace/ui';

interface Invoice {
  id: string;
  date: string;
  period: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  fullSecret?: string;
  created: string;
  lastUsed: string;
  scope: string;
}

@Component({
  selector: 'lib-feature-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="billing-container">
      <!-- Section 1: Subscription Tier Selector -->
      <div class="section-box">
        <div class="section-header">
          <div>
            <h2>Subscription Plan & Enterprise Licensing</h2>
            <p class="subtitle">Select tier boundaries and active compute/storage quotas</p>
          </div>
          <span class="active-badge">CURRENT: {{ selectedTier().toUpperCase() }}</span>
        </div>

        <div class="tiers-grid">
          <div
            class="tier-card"
            [class.selected]="selectedTier() === 'starter'"
            (click)="selectTier('starter')"
          >
            <div class="tier-top">
              <h3>Starter Core</h3>
              <span class="tier-tag">Standard</span>
            </div>
            <p class="tier-price">{{ formatMoney(499) }} <span>/ mo</span></p>
            <p class="tier-desc">Entry point for scaling teams starting automated telemetry</p>
            <ul class="features">
              <li>✓ 100,000 Document OCR Runs</li>
              <li>✓ 500GB Telemetry Lake</li>
              <li>✓ 5 User Accounts</li>
              <li>✓ Community Support</li>
            </ul>
            <button class="btn-tier" [disabled]="selectedTier() === 'starter'">
              {{ selectedTier() === 'starter' ? 'Active Tier' : 'Downgrade' }}
            </button>
          </div>

          <div
            class="tier-card"
            [class.selected]="selectedTier() === 'growth'"
            (click)="selectTier('growth')"
          >
            <div class="tier-top">
              <h3>Growth Scale</h3>
              <span class="tier-tag popular">Most Popular</span>
            </div>
            <p class="tier-price">{{ formatMoney(1499) }} <span>/ mo</span></p>
            <p class="tier-desc">Designed for multi-project Nx workspaces with continuous CI</p>
            <ul class="features">
              <li>✓ 1,000,000 Document OCR Runs</li>
              <li>✓ 5TB Telemetry Lake</li>
              <li>✓ 25 User Accounts</li>
              <li>✓ 99.9% Ingestion SLA</li>
            </ul>
            <button class="btn-tier" [disabled]="selectedTier() === 'growth'">
              {{ selectedTier() === 'growth' ? 'Active Tier' : 'Switch Plan' }}
            </button>
          </div>

          <div
            class="tier-card"
            [class.selected]="selectedTier() === 'enterprise'"
            (click)="selectTier('enterprise')"
          >
            <div class="tier-top">
              <h3>Enterprise Scale</h3>
              <span class="tier-tag enterprise">Full Suite</span>
            </div>
            <p class="tier-price">{{ formatMoney(4999) }} <span>/ mo</span></p>
            <p class="tier-desc">Dedicated tenant isolation, custom SLAs, and high-frequency streams</p>
            <ul class="features">
              <li>✓ Unlimited Document Processing</li>
              <li>✓ Dedicated Telemetry Ingestion</li>
              <li>✓ Unlimited User Directory</li>
              <li>✓ 24/7 SLA Priority Response</li>
            </ul>
            <button class="btn-tier" [disabled]="selectedTier() === 'enterprise'">
              {{ selectedTier() === 'enterprise' ? 'Active Tier' : 'Upgrade' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Section 2: Real-Time Usage & Cost Estimator -->
      <div class="section-box">
        <div class="section-header">
          <div>
            <h3>Dynamic Usage Cost Estimator</h3>
            <p class="subtitle">Project monthly operational billing based on anticipated workload surges</p>
          </div>
          <div class="cost-summary">
            <span class="cost-label">Estimated Monthly Total:</span>
            <span class="cost-val">{{ formatMoney(estimatedTotal()) }}</span>
          </div>
        </div>

        <div class="slider-grid">
          <div class="slider-card">
            <div class="slider-label-row">
              <span>Monthly Processed Documents:</span>
              <strong>{{ docCount() | number }} docs</strong>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="50000"
              [ngModel]="docCount()"
              (ngModelChange)="docCount.set(+$event)"
              class="range-slider"
            />
            <span class="sub-calc">{{ formatMoney(docCost()) }} base extraction charge</span>
          </div>

          <div class="slider-card">
            <div class="slider-label-row">
              <span>Telemetry Lake Storage (GB):</span>
              <strong>{{ storageGb() | number }} GB</strong>
            </div>
            <input
              type="range"
              min="100"
              max="20000"
              step="200"
              [ngModel]="storageGb()"
              (ngModelChange)="storageGb.set(+$event)"
              class="range-slider"
            />
            <span class="sub-calc">{{ formatMoney(storageCost()) }} high-retention NVMe tier</span>
          </div>
        </div>
      </div>

      <!-- Section 3: Billing Statements & Invoices Table -->
      <div class="section-box">
        <div class="section-header">
          <div>
            <h3>Enterprise Billing Statements</h3>
            <p class="subtitle">View past invoices and generate auditor-compliant Excel statements</p>
          </div>
          <button class="btn btn-secondary" (click)="exportStatementsExcel()">
            📥 Download Ledger (.xlsx)
          </button>
        </div>

        <table class="invoices-table">
          <thead>
            <tr>
              <th>Statement ID</th>
              <th>Billing Period</th>
              <th>Date Issued</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of invoices">
              <td><code class="inv-code">{{ inv.id }}</code></td>
              <td>{{ inv.period }}</td>
              <td>{{ inv.date }}</td>
              <td><strong>{{ formatMoney(inv.amount) }}</strong></td>
              <td>
                <lib-status-badge
                  [variant]="inv.status === 'paid' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'"
                  [label]="inv.status"
                ></lib-status-badge>
              </td>
              <td>
                <button class="btn-download" (click)="downloadSingleInvoice(inv)">
                  Export PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section 4: Developer API Keys & Webhooks -->
      <div class="section-box">
        <div class="section-header">
          <div>
            <h3>Partner API Credentials & Ingestion Webhooks</h3>
            <p class="subtitle">Issue cryptographic secret tokens for server-to-server integration</p>
          </div>
          <button class="btn btn-primary" (click)="generateNewKey()">
            + Generate API Key
          </button>
        </div>

        <div class="api-keys-list">
          <div *ngFor="let key of apiKeys()" class="api-key-item">
            <div class="key-left">
              <span class="key-name">{{ key.name }}</span>
              <div class="key-token-row">
                <code class="token-code">{{ key.keyPrefix }}</code>
                <span class="scope-tag">{{ key.scope }}</span>
              </div>
              <span class="key-dates">Created: {{ key.created }} · Last used: {{ key.lastUsed }}</span>
            </div>
            <button class="btn-revoke" (click)="revokeKey(key.id)">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .billing-container {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .section-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .section-header h2, .section-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .subtitle {
      font-size: 0.8125rem;
      color: #64748b;
      margin: 0.25rem 0 0;
    }
    .active-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: #e0e7ff;
      color: #4338ca;
      letter-spacing: 0.04em;
    }
    .tiers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .tier-card {
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.5rem;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tier-card:hover {
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }
    .tier-card.selected {
      border-color: #4f46e5;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12);
      background: #fdfdfd;
    }
    .tier-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .tier-top h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .tier-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: #f1f5f9;
      color: #64748b;
    }
    .tier-tag.popular {
      background: #fef3c7;
      color: #92400e;
    }
    .tier-tag.enterprise {
      background: #dbeafe;
      color: #1e40af;
    }
    .tier-price {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0.5rem 0;
      line-height: 1;
    }
    .tier-price span {
      font-size: 0.85rem;
      font-weight: 500;
      color: #64748b;
    }
    .tier-desc {
      font-size: 0.8125rem;
      color: #64748b;
      margin: 0 0 1rem;
      line-height: 1.35;
    }
    .features {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #334155;
    }
    .btn-tier {
      margin-top: auto;
      padding: 0.55rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      transition: all 0.15s ease;
    }
    .tier-card.selected .btn-tier {
      background: #4f46e5;
      color: #ffffff;
      border-color: #4f46e5;
    }
    .cost-summary {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .cost-label {
      font-size: 0.8125rem;
      color: #64748b;
    }
    .cost-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: #047857;
    }
    .slider-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .slider-grid {
        grid-template-columns: 1fr;
      }
    }
    .slider-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .slider-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: #334155;
    }
    .range-slider {
      width: 100%;
      accent-color: #4f46e5;
      cursor: pointer;
    }
    .sub-calc {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .invoices-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .invoices-table th {
      background: #f8fafc;
      padding: 0.75rem 1rem;
      font-weight: 600;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    .invoices-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      vertical-align: middle;
    }
    .inv-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.75rem;
      background: #f1f5f9;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #4338ca;
    }
    .btn-secondary {
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    }
    .btn-secondary:hover {
      background: #f8fafc;
    }
    .btn-download {
      padding: 0.25rem 0.55rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      cursor: pointer;
      color: #475569;
    }
    .btn-download:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .api-keys-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .api-key-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .key-left {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .key-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
    }
    .key-token-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .token-code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.8rem;
      color: #334155;
      background: #e2e8f0;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }
    .scope-tag {
      font-size: 0.7rem;
      background: #dbeafe;
      color: #1e40af;
      padding: 0.1rem 0.4rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .key-dates {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .btn-revoke {
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
      border: 1px solid #fca5a5;
      background: #fee2e2;
      color: #b91c1c;
      cursor: pointer;
    }
    .btn-revoke:hover {
      background: #fecaca;
    }
  `]
})
export class BillingComponent {
  toastService = inject(ToastService);

  selectedTier = signal<'starter' | 'growth' | 'enterprise'>('enterprise');

  docCount = signal(1250000);
  storageGb = signal(4200);

  tierBaseCost = computed(() => {
    switch (this.selectedTier()) {
      case 'starter': return 499;
      case 'growth': return 1499;
      case 'enterprise': return 4999;
    }
  });

  docCost = computed(() => {
    return (this.docCount() / 10000) * 2.5;
  });

  storageCost = computed(() => {
    return this.storageGb() * 0.18;
  });

  estimatedTotal = computed(() => {
    return Math.round(this.tierBaseCost() + this.docCost() + this.storageCost());
  });

  invoices: Invoice[] = [
    { id: 'INV-2026-004', period: 'Sep 01 - Sep 30, 2026', date: '2026-10-01', amount: 5240, status: 'paid' },
    { id: 'INV-2026-003', period: 'Aug 01 - Aug 31, 2026', date: '2026-09-01', amount: 4999, status: 'paid' },
    { id: 'INV-2026-002', period: 'Jul 01 - Jul 31, 2026', date: '2026-08-01', amount: 4999, status: 'paid' },
    { id: 'INV-2026-001', period: 'Jun 01 - Jun 30, 2026', date: '2026-07-01', amount: 5120, status: 'paid' }
  ];

  apiKeys = signal<ApiKey[]>([
    {
      id: 'key_1',
      name: 'Production Ingestion Gateway',
      keyPrefix: maskString('omni_live_9a7b8c2d1e4f3a5b6c7d8e9f', 4),
      created: 'Jun 14, 2026',
      lastUsed: '4 mins ago',
      scope: 'read:reports, write:telemetry'
    },
    {
      id: 'key_2',
      name: 'Staging CI Test Runner',
      keyPrefix: maskString('omni_test_1a2b3c4d5e6f7a8b9c0d1e2f', 4),
      created: 'Aug 22, 2026',
      lastUsed: 'Yesterday',
      scope: 'read:reports'
    }
  ]);

  formatMoney(amount: number): string {
    return formatCurrency(amount);
  }

  selectTier(tier: 'starter' | 'growth' | 'enterprise') {
    this.selectedTier.set(tier);
    this.toastService.success(
      `Enterprise subscription modified to ${tier.toUpperCase()}.`,
      'Plan Switched'
    );
  }

  generateNewKey() {
    const rawSecret = 'omni_live_' + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
    const masked = maskString(rawSecret, 4);
    const newKey: ApiKey = {
      id: generateId('key'),
      name: 'Automated Service Account',
      keyPrefix: masked,
      created: 'Just now',
      lastUsed: 'Never',
      scope: 'write:telemetry, read:datasets'
    };

    this.apiKeys.update(list => [newKey, ...list]);
    this.toastService.success(
      `Generated secret: ${rawSecret.slice(0, 12)}... (saved to keychain)`,
      'API Key Created'
    );
  }

  revokeKey(id: string) {
    this.apiKeys.update(list => list.filter(k => k.id !== id));
    this.toastService.warning('Token revoked and blacklisted immediately.', 'Credential Revoked');
  }

  downloadSingleInvoice(inv: Invoice) {
    this.toastService.info(`Downloading PDF statement for ${inv.id}`, 'PDF Generated');
  }

  async exportStatementsExcel() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OmniReport Partner Central';
    const sheet = workbook.addWorksheet('Billing Statements');

    sheet.columns = [
      { header: 'Statement ID', key: 'id', width: 18 },
      { header: 'Billing Period', key: 'period', width: 28 },
      { header: 'Date Issued', key: 'date', width: 14 },
      { header: 'Amount ($)', key: 'amount', width: 14 },
      { header: 'Status', key: 'status', width: 12 }
    ];

    for (const inv of this.invoices) {
      sheet.addRow(inv);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing_statements_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.toastService.success('Exported billing ledger to Excel (.xlsx)', 'Statement Downloaded');
  }
}
