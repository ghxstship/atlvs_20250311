import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface EventFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EventForm({ onSubmit, onCancel, isSubmitting }: EventFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Event Name"
        name="name"
        placeholder="Enter event name"
        required
      />
      
      <FormField label="Venue" name="venue" required>
        <select
          name="venue"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select venue</option>
          <option value="Convention Center">Convention Center</option>
          <option value="Central Park">Central Park</option>
          <option value="Grand Hotel">Grand Hotel</option>
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
        label="Expected Attendees"
        name="attendees"
        type="number"
        placeholder="Enter expected number of attendees"
        required
      />
      
      <FormField label="Status" name="status" required>
        <select
          name="status"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select status</option>
          <option value="Planning">Planning</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </FormField>
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter event description"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}