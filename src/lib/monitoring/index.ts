import * as Sentry from '@sentry/react';

interface ErrorContext {
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export function initializeMonitoring() {
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
}

export function logError(error: Error, context?: ErrorContext) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: {
        ...context?.extra,
        context: context?.context
      }
    });
  } else {
    console.error('Error:', error, context);
  }
}

export function measurePerformance(name: string, fn: () => void) {
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
}

export function trackMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const usage = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };

    if (usage.usedJSHeapSize > usage.jsHeapSizeLimit * 0.9) {
      logError(new Error('High memory usage detected'), {
        context: 'memory-monitoring',
        extra: usage
      });
    }

    return usage;
  }
  return null;
}