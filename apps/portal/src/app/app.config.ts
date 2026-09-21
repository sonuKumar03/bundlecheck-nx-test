import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appRoutes } from './app.routes';
import { AppModule } from './app.module';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync()
  ]
};
