import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment-timezone';
import { TIMEZONE_CONFIG, DEFAULT_TIMEZONE_CONFIG } from './timezone.config';

@Component({
  selector: 'lib-timezone-scheduler',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scheduler-container">
      <h2>Global Timezone Scheduler</h2>
      <p>Configured zone ({{ config.defaultZone }}): {{ currentTime }}</p>
      <div class="zones-grid">
        <div class="zone-card" *ngFor="let zone of supportedZones">
          <div class="zone-name">{{ zone }}</div>
          <div class="zone-time">{{ getTimeForZone(zone) }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scheduler-container {
      padding: 1.5rem;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .zones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .zone-card {
      padding: 1rem;
      border-radius: 6px;
      background: #f1f5f9;
    }
    .zone-name {
      font-weight: 600;
      color: #334155;
    }
    .zone-time {
      margin-top: 0.5rem;
      font-family: monospace;
      color: #0f172a;
    }
  `]
})
export class TimezoneSchedulerComponent {
  config = inject(TIMEZONE_CONFIG, { optional: true }) || DEFAULT_TIMEZONE_CONFIG;
  supportedZones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata'];
  currentTime = moment().tz(this.config.defaultZone).format(this.config.format);

  getTimeForZone(zone: string): string {
    return moment().tz(zone).format('YYYY-MM-DD HH:mm:ss z');
  }
}
