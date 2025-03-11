import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface LocationFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function LocationForm({ onSubmit, onCancel, isSubmitting }: LocationFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Location Name"
        name="name"
        placeholder="Enter location name"
        required
      />
      
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
      
      <FormField
        label="Address"
        name="address"
        placeholder="Enter full address"
        required
      />
      
      <FormField
        label="Capacity"
        name="capacity"
        type="number"
        placeholder="Enter maximum capacity"
        required
      />
      
      <FormField label="Facilities" name="facilities">
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="stage" className="mr-2" />
            Stage
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="sound" className="mr-2" />
            Sound System
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="lighting" className="mr-2" />
            Lighting
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="dressing" className="mr-2" />
            Dressing Rooms
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="parking" className="mr-2" />
            Parking
          </label>
        </div>
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