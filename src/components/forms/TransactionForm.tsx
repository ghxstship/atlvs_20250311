import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface TransactionFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TransactionForm({ onSubmit, onCancel, isSubmitting }: TransactionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type" name="type" required>
          <select
            name="type"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            required
          >
            <option value="">Select type</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </FormField>

        <FormField label="Category" name="category" required>
          <select
            name="category"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            required
          >
            <option value="">Select category</option>
            <option value="Equipment">Equipment</option>
            <option value="Services">Services</option>
            <option value="Labor">Labor</option>
            <option value="Revenue">Revenue</option>
            <option value="Expense">Expense</option>
          </select>
        </FormField>
      </div>

      <FormField
        label="Description"
        name="description"
        placeholder="Enter transaction description"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Amount" name="amount" required>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-mono-500">$</span>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full pl-7 pr-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
              required
            />
          </div>
        </FormField>

        <FormField
          label="Date"
          name="date"
          type="date"
          required
        />
      </div>

      <FormField label="Account" name="account" required>
        <select
          name="account"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="">Select account</option>
          <option value="4001">4001 - Event Revenue</option>
          <option value="5001">5001 - Equipment Purchases</option>
          <option value="5002">5002 - Technical Services</option>
          <option value="5003">5003 - Labor Expenses</option>
        </select>
      </FormField>

      <FormField label="Payment Method" name="paymentMethod" required>
        <select
          name="paymentMethod"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="">Select payment method</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
          <option value="Check">Check</option>
        </select>
      </FormField>

      <FormField label="Status" name="status" required>
        <select
          name="status"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="">Select status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </FormField>

      <FormField
        label="Notes"
        name="notes"
        type="textarea"
        placeholder="Enter any additional notes"
      >
        <textarea
          name="notes"
          rows={3}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>

      <FormField label="Documents" name="documents">
        <input
          type="file"
          name="documents"
          multiple
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}