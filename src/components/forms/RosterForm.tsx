import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface RosterFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function RosterForm({ onSubmit, onCancel, isSubmitting }: RosterFormProps) {
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
      
      <FormField label="Role" name="role" required>
        <select
          name="role"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select role</option>
          <option value="Stage Manager">Stage Manager</option>
          <option value="Audio Engineer">Audio Engineer</option>
          <option value="Lighting Designer">Lighting Designer</option>
          <option value="Production Assistant">Production Assistant</option>
        </select>
      </FormField>
      
      <FormField label="Shift" name="shift" required>
        <select
          name="shift"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select shift</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
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