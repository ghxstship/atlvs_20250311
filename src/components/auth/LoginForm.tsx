import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { emailSchema, passwordSchema } from '../../lib/validation';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Sign In Form */}
      <div className="bg-white px-8 py-10 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-mono-900 mb-6">Sign In</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                placeholder="Enter your email"
              />
              <Mail className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                placeholder="Enter your password"
              />
              <Lock className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
              />
              <label className="ml-2 block text-sm text-mono-700">
                Remember me
              </label>
            </div>

            <Link
              to="/reset-password"
              className="text-sm text-accent hover:text-accent-dark"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-mono-900 text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Sign Up Section */}
      <div className="bg-white px-8 py-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-mono-900">New to our platform?</h3>
            <p className="text-sm text-mono-500 mt-1">
              Create an account to get started with all our features
            </p>
          </div>
          <Link
            to="/register"
            className="flex items-center px-4 py-2 bg-mono-100 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors"
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}