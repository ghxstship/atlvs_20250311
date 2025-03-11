import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface JobFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function JobForm({ onSubmit, onCancel, isSubmitting }: JobFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter job title"
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
        label="Location"
        name="location"
        placeholder="Enter job location"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          name="startDate"
          type="date"
          required
        />
        
        <FormField
          label="Duration (days)"
          name="duration"
          type="number"
          placeholder="Enter duration"
          required
        />
      </div>
      
      <FormField
        label="Value"
        name="value"
        type="number"
        placeholder="Enter job value"
        required
      />
      
      <FormField label="Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select type</option>
          <option value="Installation">Installation</option>
          <option value="Setup">Setup</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Support">Support</option>
        </select>
      </FormField>
      
      <FormField label="Requirements" name="requirements">
        <textarea
          name="requirements"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter job requirements"
          required
        />
      </FormField>
      
      <FormField label="Equipment Needed" name="equipment">
        <textarea
          name="equipment"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="List required equipment"
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