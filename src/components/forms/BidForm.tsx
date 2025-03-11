import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface BidFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function BidForm({ onSubmit, onCancel, isSubmitting }: BidFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter bid title"
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
      
      <FormField
        label="Amount"
        name="amount"
        type="number"
        placeholder="Enter bid amount"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Submission Date"
          name="submittedDate"
          type="date"
          required
        />
        
        <FormField
          label="Due Date"
          name="dueDate"
          type="date"
          required
        />
      </div>
      
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
      
      <FormField label="Scope" name="scope">
        <textarea
          name="scope"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter bid scope and details"
          required
        />
      </FormField>
      
      <FormField label="Terms & Conditions" name="terms">
        <textarea
          name="terms"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter terms and conditions"
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