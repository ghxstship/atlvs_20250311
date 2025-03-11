import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface TimekeepingFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TimekeepingForm({ onSubmit, onCancel, isSubmitting }: TimekeepingFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField label="Employee" name="employee" required>
        <select
          name="employee"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select employee</option>
          <option value="Sarah Chen">Sarah Chen</option>
          <option value="Mike Thompson">Mike Thompson</option>
          <option value="David Wilson">David Wilson</option>
        </select>
      </FormField>
      
      <FormField label="Project" name="project" required>
        <select
          name="project"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select project</option>
          <option value="Summer Music Festival">Summer Music Festival</option>
          <option value="Corporate Event">Corporate Event</option>
          <option value="Theater Production">Theater Production</option>
        </select>
      </FormField>
      
      <FormField
        label="Date"
        name="date"
        type="date"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Clock In"
          name="clockIn"
          type="time"
          required
        />
        
        <FormField
          label="Clock Out"
          name="clockOut"
          type="time"
          required
        />
      </div>
      
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