import { NgModule } from '@angular/core';
// GOTCHA: Accidental Entrypoint Leak
// Importing a small constant directly from the lazy-loaded @nx-workspace/timezone-scheduler
// barrel into the main app module pulls the entire moment & moment-timezone tree into initial main bundle!
import { DEFAULT_TIMEZONE_CONFIG, TIMEZONE_CONFIG } from '@nx-workspace/timezone-scheduler';

@NgModule({
  providers: [
    {
      provide: TIMEZONE_CONFIG,
      useValue: DEFAULT_TIMEZONE_CONFIG
    }
  ]
})
export class AppModule {}
