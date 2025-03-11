import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthProvider';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

export default function ResetPassword() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-mono-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mono-900">Reset Password</h1>
          <p className="mt-2 text-lg text-mono-600">We'll help you get back into your account</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}