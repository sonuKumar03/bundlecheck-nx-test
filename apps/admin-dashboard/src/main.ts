import { bootstrapApplication } from '@angular/platform-browser';
import * as ExcelJS from 'exceljs';
import _ from 'lodash';
import { appConfig } from './app/app.config';
import { AdminAppComponent } from './app/app.component';

// BundleRadar fixture preservation
export function adminBundleFixtures() {
  const wb = new ExcelJS.Workbook();
  const sample = _.groupBy([{ role: 'admin' }], 'role');
  return { wb, sample };
}

bootstrapApplication(AdminAppComponent, appConfig)
  .catch((err) => console.error(err));
