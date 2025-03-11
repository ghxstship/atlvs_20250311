import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { passwordSchema } from '../../lib/validation';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string()
    .min(2, 'Full name is required')
    .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Please enter a valid full name'),
  companyName: z.string()
    .min(2, 'Company name is required')
    .max(100, 'Company name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.&]+$/, 'Company name contains invalid characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { signUp, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signUp(data.email, data.password, {
        full_name: data.fullName,
        company_name: data.companyName
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Registration Form */}
      <div className="bg-white px-8 py-10 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-mono-900 mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              {...register('companyName')}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter your company name"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-mono-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-mono-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center px-4 py-2 border border-mono-300 rounded-lg hover:bg-mono-50"
            >
              <Mail className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-mono-700">Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sign In Section */}
      <div className="bg-white px-8 py-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-mono-900">Already have an account?</h3>
            <p className="text-sm text-mono-500 mt-1">
              Sign in to access your account and continue where you left off
            </p>
          </div>
          <Link
            to="/login"
            className="flex items-center px-4 py-2 bg-mono-100 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors"
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}