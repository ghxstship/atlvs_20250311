import React, { useState } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { useSubscription } from '../hooks/useSubscription';
import { CreditCard, Package, Clock, AlertTriangle, ChevronRight, Loader2, Users } from 'lucide-react';

export default function Account() {
  const { user } = useAuth();
  const { 
    subscription, 
    isLoading,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    isCreating,
    isUpdating,
    isCanceling
  } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-mono-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-mono-900 mb-6">Subscription</h2>
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-mono-900">
                  {subscription ? subscription.price?.product?.name : 'No Active Subscription'}
                </h3>
                {subscription && (
                  <p className="mt-1 text-sm text-mono-500">
                    {subscription.status === 'active' ? (
                      <>
                        Your plan renews on{' '}
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </>
                    ) : (
                      'Subscription inactive'
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={() => {/* Handle subscription management */}}
                className="flex items-center text-sm text-accent hover:text-accent-dark"
              >
                Manage Subscription
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {subscription?.status === 'past_due' && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Payment Past Due</h4>
                  <p className="mt-1 text-sm text-red-700">
                    Your last payment was unsuccessful. Please update your payment method to continue access to premium features.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-mono-900 mb-6">Billing History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-mono-200">
                    <th className="pb-3 text-sm font-medium text-mono-500">Date</th>
                    <th className="pb-3 text-sm font-medium text-mono-500">Description</th>
                    <th className="pb-3 text-sm font-medium text-mono-500">Amount</th>
                    <th className="pb-3 text-sm font-medium text-mono-500">Status</th>
                    <th className="pb-3 text-sm font-medium text-mono-500">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mono-200">
                  {/* Sample billing history - replace with actual data */}
                  <tr>
                    <td className="py-4 text-sm text-mono-600">Mar 1, 2024</td>
                    <td className="py-4 text-sm text-mono-900">Pro Plan Subscription</td>
                    <td className="py-4 text-sm text-mono-600">$29.99</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-sm text-accent hover:text-accent-dark">
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-mono-900">Payment Methods</h2>
              <button className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent">
                Add Payment Method
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-mono-200 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-mono-400 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-mono-900">•••• 4242</p>
                    <p className="text-sm text-mono-500">Expires 12/25</p>
                  </div>
                </div>
                <button className="text-sm text-mono-600 hover:text-mono-900">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage & Limits */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-mono-900 mb-6">Usage & Limits</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-mono-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-mono-900">Storage</h3>
                  <Package className="w-5 h-5 text-mono-400" />
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-mono-500">Used</span>
                    <span className="text-mono-900">2.5 GB / 10 GB</span>
                  </div>
                  <div className="h-2 bg-mono-100 rounded-full">
                    <div className="h-2 bg-mono-900 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-mono-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-mono-900">API Calls</h3>
                  <Clock className="w-5 h-5 text-mono-400" />
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-mono-500">Used</span>
                    <span className="text-mono-900">75K / 100K</span>
                  </div>
                  <div className="h-2 bg-mono-100 rounded-full">
                    <div className="h-2 bg-mono-900 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-mono-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-mono-900">Team Members</h3>
                  <Users className="w-5 h-5 text-mono-400" />
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-mono-500">Used</span>
                    <span className="text-mono-900">8 / 10</span>
                  </div>
                  <div className="h-2 bg-mono-100 rounded-full">
                    <div className="h-2 bg-mono-900 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}