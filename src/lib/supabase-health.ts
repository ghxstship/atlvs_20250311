import { supabase } from './supabase';
import { logError } from './monitoring';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
    auth: boolean;
    storage: boolean;
    realtime: boolean;
  };
  latency: {
    database: number;
    auth: number;
    storage: number;
    realtime: number;
  };
  errors?: string[];
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const errors: string[] = [];
  const startTime = Date.now();
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: false,
      auth: false,
      storage: false,
      realtime: false
    },
    latency: {
      database: 0,
      auth: 0,
      storage: 0,
      realtime: 0
    }
  };

  try {
    // Check database
    const dbStart = Date.now();
    const { error: dbError } = await supabase
      .from('health_checks')
      .select('count')
      .single();
    result.latency.database = Date.now() - dbStart;
    result.checks.database = !dbError;
    if (dbError) errors.push(`Database error: ${dbError.message}`);

    // Check auth
    const authStart = Date.now();
    const { error: authError } = await supabase.auth.getSession();
    result.latency.auth = Date.now() - authStart;
    result.checks.auth = !authError;
    if (authError) errors.push(`Auth error: ${authError.message}`);

    // Check storage
    const storageStart = Date.now();
    const { error: storageError } = await supabase.storage
      .from('public')
      .list();
    result.latency.storage = Date.now() - storageStart;
    result.checks.storage = !storageError;
    if (storageError) errors.push(`Storage error: ${storageError.message}`);

    // Check realtime
    const realtimeStart = Date.now();
    const channel = supabase.channel('health_check');
    const subscription = await new Promise<boolean>((resolve) => {
      channel
        .subscribe((status) => {
          resolve(status === 'SUBSCRIBED');
          channel.unsubscribe();
        });
    });
    result.latency.realtime = Date.now() - realtimeStart;
    result.checks.realtime = subscription;
    if (!subscription) errors.push('Realtime subscription failed');

    // Determine overall status
    const totalChecks = Object.values(result.checks).length;
    const passedChecks = Object.values(result.checks).filter(Boolean).length;

    if (passedChecks === totalChecks) {
      result.status = 'healthy';
    } else if (passedChecks >= totalChecks / 2) {
      result.status = 'degraded';
    } else {
      result.status = 'unhealthy';
    }

    if (errors.length > 0) {
      result.errors = errors;
    }

    // Log if not healthy
    if (result.status !== 'healthy') {
      logError(
        new Error('Supabase health check failed'),
        { healthCheck: result }
      );
    }

    return result;
  } catch (error) {
    logError(error as Error, { context: 'health-check' });
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: false,
        auth: false,
        storage: false,
        realtime: false
      },
      latency: {
        database: 0,
        auth: 0,
        storage: 0,
        realtime: 0
      },
      errors: [(error as Error).message]
    };
  }
}

export async function monitorHealthMetrics(
  interval: number = 300000 // 5 minutes
): Promise<NodeJS.Timer> {
  return setInterval(async () => {
    const health = await performHealthCheck();
    
    // Log metrics in production
    if (process.env.NODE_ENV === 'production') {
      // Implement your metrics logging here
      console.info('Health check results:', health);
    }

    // Alert on degraded or unhealthy status
    if (health.status !== 'healthy') {
      logError(
        new Error(`Supabase health check failed: ${health.status}`),
        { healthCheck: health }
      );
    }
  }, interval);
}

export function stopHealthMonitoring(timer: NodeJS.Timer) {
  clearInterval(timer);
}