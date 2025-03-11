import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface BookingFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function BookingForm({ onSubmit, onCancel, isSubmitting }: BookingFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField label="Event" name="event" required>
        <select
          name="event"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select event</option>
          <option value="1">Tech Conference 2024</option>
          <option value="2">Music Festival</option>
          <option value="3">Corporate Summit</option>
        </select>
      </FormField>
      
      <FormField label="Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select type</option>
          <option value="Venue">Venue</option>
          <option value="Equipment">Equipment</option>
          <option value="Catering">Catering</option>
          <option value="Staff">Staff</option>
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
        label="Location"
        name="location"
        placeholder="Enter location"
        required
      />
      
      <FormField
        label="Quantity"
        name="quantity"
        type="number"
        placeholder="Enter quantity needed"
        required
      />
      
      <FormField label="Notes" name="notes">
        <textarea
          name="notes"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any additional notes or requirements"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}