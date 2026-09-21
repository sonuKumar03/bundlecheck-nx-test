import { InjectionToken } from '@angular/core';

export interface TimezoneSettings {
  defaultZone: string;
  format: string;
}

export const TIMEZONE_CONFIG = new InjectionToken<TimezoneSettings>('TIMEZONE_CONFIG');

export const DEFAULT_TIMEZONE_CONFIG: TimezoneSettings = {
  defaultZone: 'America/New_York',
  format: 'YYYY-MM-DD HH:mm:ss z'
};
