import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface TaskFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Task Title"
        name="title"
        placeholder="Enter task title"
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
      
      <FormField label="Assignee" name="assignee" required>
        <select
          name="assignee"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select assignee</option>
          <option value="1">Alex Thompson</option>
          <option value="2">Maria Garcia</option>
          <option value="3">James Wilson</option>
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
      
      <FormField label="Description" name="description">
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter task description"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}