import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface LogisticsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function LogisticsForm({ onSubmit, onCancel, isSubmitting }: LogisticsFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Description"
        name="description"
        placeholder="Enter shipment description"
        required
      />
      
      <FormField label="Origin" name="origin" required>
        <select
          name="origin"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select origin</option>
          <option value="Warehouse A">Warehouse A</option>
          <option value="Warehouse B">Warehouse B</option>
          <option value="Venue B">Venue B</option>
          <option value="Festival Grounds">Festival Grounds</option>
        </select>
      </FormField>
      
      <FormField label="Destination" name="destination" required>
        <select
          name="destination"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select destination</option>
          <option value="Convention Center">Convention Center</option>
          <option value="Festival Grounds">Festival Grounds</option>
          <option value="Warehouse A">Warehouse A</option>
          <option value="Warehouse B">Warehouse B</option>
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Departure Date"
          name="departureDate"
          type="date"
          required
        />
        
        <FormField
          label="Expected Arrival Date"
          name="arrivalDate"
          type="date"
          required
        />
      </div>

      <FormField label="Carrier" name="carrier" required>
        <select
          name="carrier"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select carrier</option>
          <option value="Express Logistics">Express Logistics</option>
          <option value="Swift Transport">Swift Transport</option>
          <option value="Premier Shipping">Premier Shipping</option>
        </select>
      </FormField>

      <FormField
        label="Tracking Number"
        name="trackingNumber"
        placeholder="Enter tracking number"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Weight (kg)"
          name="weight"
          type="number"
          placeholder="Enter shipment weight"
          required
        />

        <FormField
          label="Pieces"
          name="pieces"
          type="number"
          placeholder="Enter number of pieces"
          required
        />
      </div>

      <FormField label="Special Instructions" name="instructions">
        <textarea
          name="instructions"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any special handling instructions"
        />
      </FormField>

      <FormField label="Insurance Required" name="insurance">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="insurance"
            className="rounded border-mono-300 text-mono-900 focus:ring-mono-500"
          />
          <span className="text-sm text-mono-600">
            Add shipping insurance for this shipment
          </span>
        </div>
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}