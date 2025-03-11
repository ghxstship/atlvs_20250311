import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface MediaFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function MediaForm({ onSubmit, onCancel, isSubmitting }: MediaFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter media title"
        required
      />
      
      <FormField label="Type" name="type" required>
        <select
          name="type"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select type</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="document">Document</option>
        </select>
      </FormField>
      
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
      
      <FormField
        label="File"
        name="file"
        type="file"
        required
      />
      
      <FormField label="Tags" name="tags">
        <input
          type="text"
          name="tags"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter tags separated by commas"
        />
      </FormField>
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter media description"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}