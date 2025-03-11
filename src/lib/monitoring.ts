import * as Sentry from '@sentry/react';

export const initializeMonitoring = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay()
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE
    });
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { 
      extra: context,
      tags: {
        environment: import.meta.env.MODE,
        ...context?.tags
      }
    });
  } else {
    console.error('Error:', error, context);
  }
};

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  
  if (duration > 100) {
    console.warn(`Performance warning: ${name} took ${duration}ms`);
    if (import.meta.env.PROD) {
      Sentry.captureMessage(`Long task: ${name} took ${duration}ms`, {
        level: 'warning',
        tags: { type: 'performance' }
      });
    }
  }
};