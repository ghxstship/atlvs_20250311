import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface BudgetFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function BudgetForm({ onSubmit, onCancel, isSubmitting }: BudgetFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Category"
        name="category"
        placeholder="Enter budget category"
        required
      />
      
      <FormField
        label="Allocated Amount"
        name="allocated"
        type="number"
        placeholder="Enter allocated amount"
        required
      />
      
      <FormField label="Period" name="period" required>
        <select
          name="period"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select period</option>
          <option value="Q1">Q1 2024</option>
          <option value="Q2">Q2 2024</option>
          <option value="Q3">Q3 2024</option>
          <option value="Q4">Q4 2024</option>
          <option value="Annual">Annual 2024</option>
        </select>
      </FormField>
      
      <FormField label="Department" name="department" required>
        <select
          name="department"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select department</option>
          <option value="Production">Production</option>
          <option value="Technical">Technical</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
        </select>
      </FormField>
      
      <FormField
        label="Start Date"
        name="startDate"
        type="date"
        required
      />
      
      <FormField
        label="End Date"
        name="endDate"
        type="date"
        required
      />
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter budget description and purpose"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}