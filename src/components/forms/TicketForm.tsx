import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface TicketFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TicketForm({ onSubmit, onCancel, isSubmitting }: TicketFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField label="Event" name="event" required>
        <select
          name="event"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select event</option>
          <option value="1">Summer Music Festival</option>
          <option value="2">Tech Conference 2024</option>
          <option value="3">Theater Production</option>
        </select>
      </FormField>
      
      <FormField
        label="Ticket Type"
        name="type"
        placeholder="Enter ticket type"
        required
      />
      
      <FormField
        label="Price"
        name="price"
        type="number"
        placeholder="Enter ticket price"
        required
      />
      
      <FormField
        label="Quantity Available"
        name="available"
        type="number"
        placeholder="Enter quantity available"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Sale Start"
          name="saleStart"
          type="date"
          required
        />
        
        <FormField
          label="Sale End"
          name="saleEnd"
          type="date"
          required
        />
      </div>
      
      <FormField label="Status" name="status" required>
        <select
          name="status"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select status</option>
          <option value="On Sale">On Sale</option>
          <option value="Coming Soon">Coming Soon</option>
          <option value="Sold Out">Sold Out</option>
        </select>
      </FormField>
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter ticket description"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}