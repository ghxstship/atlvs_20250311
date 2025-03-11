import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ServiceFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ServiceForm({ onSubmit, onCancel, isSubmitting }: ServiceFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField label="Asset" name="asset" required>
        <select
          name="asset"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select asset</option>
          <option value="Stage System A">Stage System A</option>
          <option value="Sound System Pro">Sound System Pro</option>
          <option value="LED Wall 4K">LED Wall 4K</option>
        </select>
      </FormField>
      
      <FormField label="Service Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select type</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Repair">Repair</option>
          <option value="Inspection">Inspection</option>
          <option value="Calibration">Calibration</option>
        </select>
      </FormField>
      
      <FormField
        label="Due Date"
        name="dueDate"
        type="date"
        required
      />
      
      <FormField label="Priority" name="priority" required>
        <select
          name="priority"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </FormField>
      
      <FormField label="Assignee" name="assignee" required>
        <select
          name="assignee"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select assignee</option>
          <option value="John Smith">John Smith</option>
          <option value="Mike Wilson">Mike Wilson</option>
          <option value="Sarah Chen">Sarah Chen</option>
        </select>
      </FormField>
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter service description and requirements"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}