import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface FileFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function FileForm({ onSubmit, onCancel, isSubmitting }: FileFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="File"
        name="file"
        type="file"
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
      
      <FormField label="Category" name="category" required>
        <select
          name="category"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select category</option>
          <option value="Documents">Documents</option>
          <option value="Plans">Plans</option>
          <option value="Contracts">Contracts</option>
          <option value="Reports">Reports</option>
          <option value="Other">Other</option>
        </select>
      </FormField>
      
      <FormField
        label="Description"
        name="description"
        placeholder="Enter file description"
      />
      
      <FormField label="Access Level" name="accessLevel" required>
        <select
          name="accessLevel"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select access level</option>
          <option value="Public">Public</option>
          <option value="Team">Team Only</option>
          <option value="Private">Private</option>
        </select>
      </FormField>
      
      <FormField label="Tags" name="tags">
        <input
          type="text"
          name="tags"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter tags separated by commas"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}