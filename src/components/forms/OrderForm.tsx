import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface OrderFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function OrderForm({ onSubmit, onCancel, isSubmitting }: OrderFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Description"
        name="description"
        placeholder="Enter order description"
        required
      />
      
      <FormField label="Supplier" name="supplier" required>
        <select
          name="supplier"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="">Select supplier</option>
          <option value="Pro Audio Systems">Pro Audio Systems</option>
          <option value="Stage Lighting Co">Stage Lighting Co</option>
          <option value="Sound Solutions Ltd">Sound Solutions Ltd</option>
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
        label="Order Date"
        name="orderDate"
        type="date"
        required
      />
      
      <FormField
        label="Required By"
        name="requiredDate"
        type="date"
        required
      />
      
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
      
      <FormField label="Items" name="items">
        <textarea
          name="items"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter order items and quantities"
          required
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