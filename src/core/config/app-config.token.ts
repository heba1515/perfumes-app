import { InjectionToken, ValueProvider } from '@angular/core';

export interface AppConfig {
  readonly production: boolean;
  readonly siteUrl: string;
  readonly apiBaseUrl: string;
  readonly appName: string;
  readonly useMockApi?: boolean;
  readonly whatsappNumber: string;
  readonly sanity: {
    readonly projectId: string;
    readonly dataset: string;
    readonly apiVersion: string;
  };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export function provideAppConfig(config: AppConfig): ValueProvider {
  return {
    provide: APP_CONFIG,
    useValue: config,
  };
}
