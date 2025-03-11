import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export default function DemoExpired() {
  return (
    <div className="min-h-screen bg-mono-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <Clock className="w-16 h-16 text-mono-400" />
        </div>
        
        <h1 className="text-2xl font-semibold text-mono-900 mb-4">
          Demo Period Expired
        </h1>
        
        <p className="text-mono-600 mb-8">
          Thank you for trying our demo. Your 14-day trial period has ended.
          Contact our sales team to learn more about our full version and custom solutions.
        </p>
        
        <div className="space-y-4">
          <a
            href="/pricing"
            className="block w-full px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
          >
            View Pricing Plans
          </a>
          
          <a
            href="/contact"
            className="block w-full px-4 py-2 bg-white border border-mono-300 text-mono-700 rounded-lg hover:bg-mono-50"
          >
            Contact Sales
          </a>
          
          <a
            href="/login"
            className="inline-flex items-center text-accent hover:text-accent-dark"
          >
            Return to Login
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}