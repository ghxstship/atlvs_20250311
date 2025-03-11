import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { logError } from './monitoring';
import { validateInput } from './validation';
import { emailSchema, passwordSchema } from './validation';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'field-ops-management'
    }
  }
});

// Auth helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    // Validate email
    const emailValidation = validateInput(emailSchema, email);
    if (!emailValidation.success) {
      throw new Error(emailValidation.error);
    }

    // Validate password
    const passwordValidation = validateInput(passwordSchema, password);
    if (!passwordValidation.success) {
      throw new Error(passwordValidation.error);
    }

    // Validate required user data
    if (!userData.full_name?.trim() || !userData.company_name?.trim()) {
      throw new Error('Full name and company name are required');
    }

    // Create new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name.trim(),
          company_name: userData.company_name.trim()
        }
      }
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user account');

    return data;
  } catch (error) {
    logError(error as Error, { context: 'auth-signup' });
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Validate email
    const emailValidation = validateInput(emailSchema, email);
    if (!emailValidation.success) {
      throw new Error(emailValidation.error);
    }

    // Validate password
    const passwordValidation = validateInput(passwordSchema, password);
    if (!passwordValidation.success) {
      throw new Error(passwordValidation.error);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }

    if (!data.session) {
      throw new Error('No session returned after sign in');
    }

    return data;
  } catch (error) {
    logError(error as Error, { context: 'auth-signin' });
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    logError(error as Error, { context: 'auth-signout' });
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    // Validate email
    const emailValidation = validateInput(emailSchema, email);
    if (!emailValidation.success) {
      throw new Error(emailValidation.error);
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    logError(error as Error, { context: 'auth-reset-password' });
    throw error;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    // Validate new password
    const passwordValidation = validateInput(passwordSchema, newPassword);
    if (!passwordValidation.success) {
      throw new Error(passwordValidation.error);
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    logError(error as Error, { context: 'auth-update-password' });
    throw error;
  }
};

// Session management
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    logError(error as Error, { context: 'session-get' });
    throw error;
  }
};

export const onAuthStateChange = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};