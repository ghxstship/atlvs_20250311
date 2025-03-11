import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ProjectFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ProjectForm({ onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Project Name"
        name="name"
        placeholder="Enter project name"
        required
      />
      
      <FormField
        label="Client"
        name="client"
        placeholder="Enter client name"
        required
      />
      
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
        label="Budget"
        name="budget"
        type="number"
        placeholder="Enter budget amount"
        required
      />
      
      <FormField label="Status" name="status" required>
        <select
          name="status"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select status</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </FormField>
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter project description"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}