import { supabase } from './supabase';
import { logError } from './monitoring';
import { validateInput } from './validation';
import { passwordSchema } from './validation';

// Demo user credentials
const DEMO_USER = {
  email: 'demo-user@atlvs.demo',
  password: 'Demo@ATLVS2025!', // Meets password requirements
  userData: {
    full_name: 'Demo User',
    company_name: 'Demo Company',
    is_demo: true
  }
};

// Session management
let demoSessionTimeout: NodeJS.Timeout;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const initializeDemoSession = async () => {
  try {
    // Validate password meets requirements
    const passwordValidation = validateInput(passwordSchema, DEMO_USER.password);
    if (!passwordValidation.success) {
      throw new Error('Invalid demo credentials');
    }

    // First try to sign in with existing demo user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password
    });

    if (!signInError && signInData.session) {
      // Existing demo user found, register session
      await registerDemoUser(signInData.session.user.id);
      setupSessionTimeout();
      return signInData.session;
    }

    // If sign in failed, create new demo user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
      options: {
        data: DEMO_USER.userData
      }
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('Failed to create demo user');

    // Wait for user to be fully created
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Sign in with new demo user
    const { data: { session }, error: finalSignInError } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password
    });

    if (finalSignInError) throw finalSignInError;
    if (!session) throw new Error('Failed to initialize demo session');

    // Register demo user and set up timeout
    await registerDemoUser(session.user.id);
    setupSessionTimeout();

    return session;
  } catch (error) {
    logError(error as Error, { context: 'demo-session-init' });
    throw error;
  }
};

const setupSessionTimeout = () => {
  if (demoSessionTimeout) {
    clearTimeout(demoSessionTimeout);
  }

  demoSessionTimeout = setTimeout(() => {
    cleanupDemoSession();
    window.location.href = '/login?demo=expired';
  }, SESSION_TIMEOUT);
};

const registerDemoUser = async (userId: string) => {
  try {
    // Get user email
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user?.email) throw new Error('User email not found');

    // Register in demo_users table
    const { error: registerError } = await supabase.rpc('register_demo_user', {
      user_id: userId
    });

    if (registerError) throw registerError;
  } catch (error) {
    logError(error as Error, { context: 'demo-user-registration' });
    throw error;
  }
};

export const cleanupDemoSession = async () => {
  try {
    if (demoSessionTimeout) {
      clearTimeout(demoSessionTimeout);
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await supabase.rpc('cleanup_demo_data', {
        user_id: session.user.id
      });
      await supabase.auth.signOut();
    }
  } catch (error) {
    logError(error as Error, { context: 'demo-session-cleanup' });
  }
};

export const resetDemoData = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) throw new Error('No active session');

    await supabase.rpc('reset_demo_data', {
      user_id: session.user.id
    });
  } catch (error) {
    logError(error as Error, { context: 'demo-data-reset' });
    throw error;
  }
};

export const checkDemoStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('check_demo_status', {
      user_id: userId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    logError(error as Error, { context: 'demo-status-check' });
    throw error;
  }
};

// Demo analytics tracking
export const trackDemoUsage = (action: string, data?: any) => {
  if (import.meta.env.PROD) {
    // Implement your analytics tracking here
    console.info('Demo usage:', { action, data });
  }
};