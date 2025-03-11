import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-mono-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <ShieldOff className="mx-auto h-12 w-12 text-mono-400" />
        <h2 className="mt-6 text-3xl font-bold text-mono-900">Access Denied</h2>
        <p className="mt-2 text-sm text-mono-600">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mono-900 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}