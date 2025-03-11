import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface AssignmentFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AssignmentForm({ onSubmit, onCancel, isSubmitting }: AssignmentFormProps) {
  return (
    <form onSubmit={onSubmit}>
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
      
      <FormField label="Project" name="project" required>
        <select
          name="project"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select project</option>
          <option value="1">Summer Music Festival</option>
          <option value="2">Corporate Event</option>
          <option value="3">Theater Production</option>
        </select>
      </FormField>
      
      <FormField label="Assignee" name="assignee" required>
        <select
          name="assignee"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select assignee</option>
          <option value="Sarah Chen">Sarah Chen</option>
          <option value="Mike Thompson">Mike Thompson</option>
          <option value="David Chen">David Chen</option>
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