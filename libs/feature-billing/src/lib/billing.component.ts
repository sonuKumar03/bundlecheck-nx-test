import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatCurrency } from '@nx-workspace/util-formatting';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

@Component({
  selector: 'lib-feature-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="billing-container">
      <div class="billing-header">
        <h2>Enterprise Subscription & Billing</h2>
        <span class="plan-badge">Enterprise Tier — Annual</span>
      </div>

      <div class="tier-overview">
        <div class="tier-card active">
          <h3>Current Plan: Enterprise Scale</h3>
          <p class="price">{{ formatMoney(4999) }} <span>/ month</span></p>
          <ul class="features">
            <li>✓ Unlimited Document Processing</li>
            <li>✓ Dedicated Telemetry Ingestion</li>
            <li>✓ 24/7 SLA Priority Support</li>
          </ul>
        </div>
      </div>

      <div class="invoices-section">
        <h3>Recent Billing Statements</h3>
        <table class="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of invoices">
              <td><code>{{ inv.id }}</code></td>
              <td>{{ inv.date }}</td>
              <td>{{ formatMoney(inv.amount) }}</td>
              <td>
                <span [class]="'status-tag status-' + inv.status">{{ inv.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .billing-container {
      padding: 1.5rem;
      background: #ffffff;
      border-radius: 8px;
    }
    .billing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .plan-badge {
      background: #eff6ff;
      color: #1d4ed8;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.8125rem;
    }
    .tier-card {
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 1.5rem;
      background: #f8fafc;
      margin-bottom: 2rem;
    }
    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #0f172a;
    }
    .price span {
      font-size: 1rem;
      font-weight: 400;
      color: #64748b;
    }
    .features {
      list-style: none;
      padding: 0;
      margin-top: 1rem;
      color: #334155;
    }
    .features li {
      margin-bottom: 0.5rem;
    }
    .invoices-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    .invoices-table th, .invoices-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .status-tag {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-paid {
      background: #dcfce7;
      color: #15803d;
    }
  `]
})
export class BillingComponent {
  invoices: Invoice[] = [
    { id: 'INV-2026-009', date: '2026-09-01', amount: 4999, status: 'paid' },
    { id: 'INV-2026-008', date: '2026-08-01', amount: 4999, status: 'paid' },
    { id: 'INV-2026-007', date: '2026-07-01', amount: 4999, status: 'paid' }
  ];

  formatMoney(amount: number): string {
    return formatCurrency(amount);
  }
}
