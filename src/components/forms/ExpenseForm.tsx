import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ExpenseFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ExpenseForm({ onSubmit, onCancel, isSubmitting }: ExpenseFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Description"
        name="description"
        placeholder="Enter expense description"
        required
      />
      
      <FormField label="Category" name="category" required>
        <select
          name="category"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="">Select category</option>
          <option value="Equipment">Equipment</option>
          <option value="Travel">Travel</option>
          <option value="Software">Software</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Supplies">Supplies</option>
        </select>
      </FormField>
      
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
      
      <FormField label="Payment Method" name="paymentMethod" required>
        <select
          name="paymentMethod"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="">Select payment method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
          <option value="Check">Check</option>
        </select>
      </FormField>
      
      <FormField label="Project" name="project">
        <select
          name="project"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select project (optional)</option>
          <option value="1">Summer Music Festival</option>
          <option value="2">Corporate Event</option>
          <option value="3">Theater Production</option>
        </select>
      </FormField>
      
      <FormField label="Receipt" name="receipt">
        <input
          type="file"
          name="receipt"
          accept="image/*,.pdf"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>
      
      <FormField label="Notes" name="notes">
        <textarea
          name="notes"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any additional notes"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}