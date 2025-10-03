import { environment } from '@env/environment';

import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';

import { appFeature } from '@store/app/app.feature';

import { routes } from './app.routes';
import * as appApiEffect from './store/app/app.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    environment.providers,
    provideStore(),
    provideEffects(appApiEffect),
    provideState(appFeature),
  ],
};
