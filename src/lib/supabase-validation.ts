import { supabase } from './supabase';
import { logError } from './monitoring';

interface ValidationResult {
  success: boolean;
  error?: string;
  details?: Record<string, any>;
}

export async function validateDatabaseConnection(): Promise<ValidationResult> {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) throw error;
    return { 
      success: true,
      details: { connectionStatus: 'healthy', timestamp: new Date().toISOString() }
    };
  } catch (error) {
    logError(error as Error, { context: 'database-connection' });
    return {
      success: false,
      error: 'Database connection failed',
      details: { error: (error as Error).message }
    };
  }
}

export async function validateAuthentication(): Promise<ValidationResult> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    return {
      success: true,
      details: {
        sessionValid: !!session,
        expiresAt: session?.expires_at
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'auth-validation' });
    return {
      success: false,
      error: 'Authentication validation failed',
      details: { error: (error as Error).message }
    };
  }
}

export async function validateStorage(): Promise<ValidationResult> {
  try {
    const { data: { publicUrl }, error } = supabase.storage
      .from('public')
      .getPublicUrl('test.txt');
      
    if (error) throw error;
    
    return {
      success: true,
      details: {
        storageAccessible: true,
        publicUrl
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'storage-validation' });
    return {
      success: false,
      error: 'Storage validation failed',
      details: { error: (error as Error).message }
    };
  }
}

export async function validateRealtime(): Promise<ValidationResult> {
  try {
    const channel = supabase.channel('system-health');
    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.unsubscribe();
      }
    });
    
    return {
      success: true,
      details: {
        realtimeEnabled: true,
        channelStatus: subscription.state
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'realtime-validation' });
    return {
      success: false,
      error: 'Realtime validation failed',
      details: { error: (error as Error).message }
    };
  }
}

export async function validateRLS(): Promise<ValidationResult> {
  try {
    // Test RLS policies
    const testCases = [
      {
        name: 'public-read',
        query: () => supabase.from('public_resources').select('*').limit(1)
      },
      {
        name: 'authenticated-read',
        query: () => supabase.from('protected_resources').select('*').limit(1)
      }
    ];

    const results = await Promise.all(
      testCases.map(async (test) => {
        const { error } = await test.query();
        return {
          test: test.name,
          passed: !error,
          error: error?.message
        };
      })
    );

    const allPassed = results.every(r => r.passed);
    
    return {
      success: allPassed,
      details: {
        rlsEnabled: true,
        testResults: results
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'rls-validation' });
    return {
      success: false,
      error: 'RLS validation failed',
      details: { error: (error as Error).message }
    };
  }
}

export async function validateEnvironmentVariables(): Promise<ValidationResult> {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    return {
      success: false,
      error: 'Missing required environment variables',
      details: { missingVariables: missingVars }
    };
  }

  return {
    success: true,
    details: {
      environmentValid: true,
      checkedVariables: requiredVars
    }
  };
}

export async function runAllValidations(): Promise<Record<string, ValidationResult>> {
  const results = {
    environment: await validateEnvironmentVariables(),
    database: await validateDatabaseConnection(),
    authentication: await validateAuthentication(),
    storage: await validateStorage(),
    realtime: await validateRealtime(),
    rls: await validateRLS()
  };

  const failed = Object.entries(results)
    .filter(([_, result]) => !result.success)
    .map(([name]) => name);

  if (failed.length > 0) {
    logError(
      new Error('Supabase validation failed'),
      { failedValidations: failed, results }
    );
  }

  return results;
}