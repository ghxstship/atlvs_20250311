import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ManningFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ManningForm({ onSubmit, onCancel, isSubmitting }: ManningFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField label="Position" name="position" required>
        <select
          name="position"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select position</option>
          <option value="Stage Manager">Stage Manager</option>
          <option value="Audio Engineer">Audio Engineer</option>
          <option value="Lighting Operator">Lighting Operator</option>
          <option value="Stage Hand">Stage Hand</option>
        </select>
      </FormField>
      
      <FormField label="Location" name="location" required>
        <select
          name="location"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select location</option>
          <option value="Main Stage">Main Stage</option>
          <option value="Sound Booth">Sound Booth</option>
          <option value="Control Room">Control Room</option>
          <option value="Backstage">Backstage</option>
        </select>
      </FormField>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Time"
          name="startTime"
          type="time"
          required
        />
        
        <FormField
          label="End Time"
          name="endTime"
          type="time"
          required
        />
      </div>
      
      <FormField label="Assignee" name="assignee">
        <select
          name="assignee"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select assignee (optional)</option>
          <option value="Sarah Chen">Sarah Chen</option>
          <option value="Mike Wilson">Mike Wilson</option>
          <option value="John Smith">John Smith</option>
        </select>
      </FormField>
      
      <FormField label="Requirements" name="requirements">
        <textarea
          name="requirements"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any specific requirements or notes"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}