import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, FeatureFlag } from '../admin-data.service';
import { StatusBadgeComponent, ToastService } from '@nx-workspace/ui';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="view-container">
      <div class="view-header">
        <div>
          <h2>Dynamic Feature Flags & Canary Rollouts</h2>
          <p class="subtitle">Enable real-time experiment gates, percentage canary releases, and selective tenant scoping</p>
        </div>
        <button class="btn btn-primary" (click)="createFlag()">
          + Add Feature Gate
        </button>
      </div>

      <div class="flags-grid">
        <div *ngFor="let flag of dataService.featureFlags()" class="flag-card">
          <div class="flag-top">
            <div class="flag-title-area">
              <span class="flag-key">{{ flag.key }}</span>
              <h3 class="flag-name">{{ flag.name }}</h3>
            </div>
            <label class="switch">
              <input
                type="checkbox"
                [checked]="flag.enabled"
                (change)="toggleFlag(flag)"
              />
              <span class="slider round"></span>
            </label>
          </div>

          <p class="flag-desc">{{ flag.description }}</p>

          <div class="rollout-section">
            <div class="rollout-labels">
              <span>Traffic Rollout:</span>
              <strong>{{ flag.rolloutPct }}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              [ngModel]="flag.rolloutPct"
              (ngModelChange)="onRolloutChange(flag, $event)"
              class="range-slider"
              [disabled]="!flag.enabled"
            />
          </div>

          <div class="flag-footer">
            <span class="scope-pill">Target: {{ flag.target }}</span>
            <lib-status-badge
              [variant]="flag.environment === 'production' ? 'success' : flag.environment === 'staging' ? 'warning' : 'info'"
              [label]="flag.environment"
            ></lib-status-badge>
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
    .flags-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.25rem;
    }
    .flag-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .flag-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }
    .flag-title-area {
      display: flex;
      flex-direction: column;
    }
    .flag-key {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.72rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      align-self: flex-start;
      margin-bottom: 0.35rem;
    }
    .flag-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }
    .flag-desc {
      font-size: 0.8125rem;
      color: #64748b;
      line-height: 1.4;
      margin: 0;
    }
    .rollout-section {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.75rem 0.85rem;
      background: #f8fafc;
      border-radius: 6px;
    }
    .rollout-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: #475569;
    }
    .range-slider {
      width: 100%;
      accent-color: #047857;
      cursor: pointer;
    }
    .range-slider:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .flag-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
    }
    .scope-pill {
      font-size: 0.75rem;
      color: #475569;
      font-weight: 500;
    }
    /* Switch toggle */
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: 0.2s;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.2s;
    }
    input:checked + .slider {
      background-color: #047857;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
    .slider.round {
      border-radius: 24px;
    }
    .slider.round:before {
      border-radius: 50%;
    }
  `]
})
export class FeatureFlagsComponent {
  dataService = inject(AdminDataService);
  toastService = inject(ToastService);

  toggleFlag(flag: FeatureFlag) {
    this.dataService.toggleFeatureFlag(flag.key);
    const state = !flag.enabled ? 'Enabled' : 'Disabled';
    this.toastService.info(`Feature flag ${flag.key} is now ${state}.`, 'Flag Toggled');
  }

  onRolloutChange(flag: FeatureFlag, pct: number) {
    this.dataService.updateRollout(flag.key, pct);
  }

  createFlag() {
    this.toastService.info('Flag builder drawer opened.', 'Feature Gates');
  }
}
