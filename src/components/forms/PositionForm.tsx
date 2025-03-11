import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface PositionFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PositionForm({ onSubmit, onCancel, isSubmitting }: PositionFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter position title"
        required
      />
      
      <FormField label="Department" name="department" required>
        <select
          name="department"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select department</option>
          <option value="Production">Production</option>
          <option value="Technical">Technical</option>
          <option value="Audio">Audio</option>
          <option value="Lighting">Lighting</option>
        </select>
      </FormField>
      
      <FormField label="Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
        </select>
      </FormField>
      
      <FormField
        label="Number of Openings"
        name="openings"
        type="number"
        placeholder="Enter number of openings"
        required
      />
      
      <FormField label="Location" name="location" required>
        <select
          name="location"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select location</option>
          <option value="Main Venue">Main Venue</option>
          <option value="Various">Various</option>
          <option value="Remote">Remote</option>
        </select>
      </FormField>
      
      <FormField label="Requirements" name="requirements">
        <textarea
          name="requirements"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter position requirements"
          required
        />
      </FormField>
      
      <FormField label="Responsibilities" name="responsibilities">
        <textarea
          name="responsibilities"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter position responsibilities"
          required
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}