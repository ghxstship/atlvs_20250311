import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface DocumentFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function DocumentForm({ onSubmit, onCancel, isSubmitting }: DocumentFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter document title"
        required
      />
      
      <FormField label="Category" name="category" required>
        <select
          name="category"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select category</option>
          <option value="Policies">Policies</option>
          <option value="Procedures">Procedures</option>
          <option value="Training">Training</option>
          <option value="Forms">Forms</option>
          <option value="Templates">Templates</option>
        </select>
      </FormField>
      
      <FormField label="Department" name="department" required>
        <select
          name="department"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select department</option>
          <option value="All">All Departments</option>
          <option value="Production">Production</option>
          <option value="Technical">Technical</option>
          <option value="HR">HR</option>
          <option value="Operations">Operations</option>
        </select>
      </FormField>
      
      <FormField
        label="File"
        name="file"
        type="file"
        required
      />
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter document description"
        />
      </FormField>
      
      <FormField label="Access Level" name="accessLevel" required>
        <select
          name="accessLevel"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select access level</option>
          <option value="Public">Public</option>
          <option value="Internal">Internal</option>
          <option value="Confidential">Confidential</option>
          <option value="Restricted">Restricted</option>
        </select>
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}