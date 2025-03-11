import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthProvider';
import RegisterForm from '../../components/auth/RegisterForm';

export default function Register() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-mono-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mono-900">Create Account</h1>
          <p className="mt-2 text-lg text-mono-600">Join our platform today</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}