import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ContractFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ContractForm({ onSubmit, onCancel, isSubmitting }: ContractFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter contract title"
        required
      />
      
      <FormField label="Company" name="company" required>
        <select
          name="company"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select company</option>
          <option value="Stage Systems Inc.">Stage Systems Inc.</option>
          <option value="Sound Solutions Ltd">Sound Solutions Ltd</option>
          <option value="Event Tech Pro">Event Tech Pro</option>
        </select>
      </FormField>
      
      <FormField label="Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select type</option>
          <option value="Supply">Supply</option>
          <option value="Service">Service</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Rental">Rental</option>
        </select>
      </FormField>
      
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      
      <FormField
        label="Value"
        name="value"
        type="number"
        placeholder="Enter contract value"
        required
      />
      
      <FormField label="Payment Terms" name="paymentTerms">
        <textarea
          name="paymentTerms"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter payment terms and schedule"
          required
        />
      </FormField>
      
      <FormField label="Scope of Work" name="scope">
        <textarea
          name="scope"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter scope of work"
          required
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