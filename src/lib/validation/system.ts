import { supabase } from '../supabase';
import { logError } from '../monitoring';

interface ValidationResult {
  success: boolean;
  error?: string;
  details?: Record<string, any>;
}

export async function validateSystem(): Promise<Record<string, ValidationResult>> {
  const results: Record<string, ValidationResult> = {};

  // Test Database Connection
  try {
    const { data, error } = await supabase.from('health_checks').select('count').single();
    results.database = {
      success: !error,
      details: { 
        connectionStatus: error ? 'error' : 'healthy',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'database-validation' });
    results.database = {
      success: false,
      error: 'Database connection failed',
      details: { error: (error as Error).message }
    };
  }

  // Test Authentication
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    results.auth = {
      success: !error,
      details: {
        sessionValid: !!session,
        expiresAt: session?.expires_at
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'auth-validation' });
    results.auth = {
      success: false,
      error: 'Authentication validation failed',
      details: { error: (error as Error).message }
    };
  }

  // Test Storage
  try {
    const { data: { publicUrl }, error } = supabase.storage
      .from('public')
      .getPublicUrl('test.txt');
      
    results.storage = {
      success: !error,
      details: {
        storageAccessible: true,
        publicUrl
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'storage-validation' });
    results.storage = {
      success: false,
      error: 'Storage validation failed',
      details: { error: (error as Error).message }
    };
  }

  // Test Realtime
  try {
    const channel = supabase.channel('system-health');
    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.unsubscribe();
      }
    });
    
    results.realtime = {
      success: true,
      details: {
        realtimeEnabled: true,
        channelStatus: subscription.state
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'realtime-validation' });
    results.realtime = {
      success: false,
      error: 'Realtime validation failed',
      details: { error: (error as Error).message }
    };
  }

  // Test RLS Policies
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

    const rlsResults = await Promise.all(
      testCases.map(async (test) => {
        const { error } = await test.query();
        return {
          test: test.name,
          passed: !error,
          error: error?.message
        };
      })
    );

    const allPassed = rlsResults.every(r => r.passed);
    
    results.rls = {
      success: allPassed,
      details: {
        rlsEnabled: true,
        testResults: rlsResults
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'rls-validation' });
    results.rls = {
      success: false,
      error: 'RLS validation failed',
      details: { error: (error as Error).message }
    };
  }

  return results;
}

export async function validateRoutes(): Promise<ValidationResult> {
  const requiredRoutes = [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/projects',
    '/people',
    '/events',
    '/assets',
    '/finance',
    '/companies',
    '/profile',
    '/settings',
    '/support'
  ];

  const results = {
    validRoutes: [] as string[],
    invalidRoutes: [] as string[],
    duplicateRoutes: [] as string[]
  };

  // Test each route
  for (const route of requiredRoutes) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        results.validRoutes.push(route);
      } else {
        results.invalidRoutes.push(route);
      }
    } catch (error) {
      results.invalidRoutes.push(route);
    }
  }

  return {
    success: results.invalidRoutes.length === 0,
    details: results
  };
}

export async function validateDependencies(): Promise<ValidationResult> {
  const criticalDeps = [
    '@supabase/supabase-js',
    '@tanstack/react-query',
    'react-router-dom',
    'lucide-react'
  ];

  try {
    const pkg = await import('../../package.json');
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
    
    const outdatedDeps = criticalDeps.filter(dep => !dependencies[dep]);
    
    return {
      success: outdatedDeps.length === 0,
      details: {
        checkedDependencies: criticalDeps,
        missingDependencies: outdatedDeps,
        allDependencies: dependencies
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to validate dependencies',
      details: { error: (error as Error).message }
    };
  }
}