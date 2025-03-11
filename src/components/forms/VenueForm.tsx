import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface VenueFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function VenueForm({ onSubmit, onCancel, isSubmitting }: VenueFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Venue Name"
        name="name"
        placeholder="Enter venue name"
        required
      />
      
      <FormField
        label="Location"
        name="location"
        placeholder="Enter venue location"
        required
      />
      
      <FormField
        label="Capacity"
        name="capacity"
        type="number"
        placeholder="Enter venue capacity"
        required
      />
      
      <FormField label="Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select venue type</option>
          <option value="Theater">Theater</option>
          <option value="Concert Hall">Concert Hall</option>
          <option value="Arena">Arena</option>
          <option value="Stadium">Stadium</option>
          <option value="Conference Center">Conference Center</option>
          <option value="Outdoor">Outdoor</option>
        </select>
      </FormField>
      
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
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="catering" className="mr-2" />
            Catering Facilities
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="loading" className="mr-2" />
            Loading Dock
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="facilities" value="power" className="mr-2" />
            Power Supply
          </label>
        </div>
      </FormField>
      
      <FormField
        label="Dimensions"
        name="dimensions"
        placeholder="Enter venue dimensions"
        required
      />
      
      <FormField
        label="Daily Rate"
        name="dailyRate"
        type="number"
        placeholder="Enter daily rental rate"
        required
      />
      
      <FormField label="Technical Specifications" name="specs">
        <textarea
          name="specs"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter technical specifications"
          required
        />
      </FormField>
      
      <FormField label="Rules & Regulations" name="rules">
        <textarea
          name="rules"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter venue rules and regulations"
        />
      </FormField>
      
      <FormField label="Images" name="images">
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>
      
      <FormField label="Floor Plans" name="floorPlans">
        <input
          type="file"
          name="floorPlans"
          multiple
          accept=".pdf,.jpg,.png"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}