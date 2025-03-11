import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ProcurementFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ProcurementForm({ onSubmit, onCancel, isSubmitting }: ProcurementFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Title"
        name="title"
        placeholder="Enter procurement title"
        required
      />
      
      <FormField label="Category" name="category" required>
        <select
          name="category"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select category</option>
          <option value="Equipment">Equipment</option>
          <option value="Services">Services</option>
          <option value="Supplies">Supplies</option>
          <option value="Software">Software</option>
        </select>
      </FormField>
      
      <FormField
        label="Budget"
        name="budget"
        type="number"
        placeholder="Enter budget amount"
        required
      />
      
      <FormField
        label="Deadline"
        name="deadline"
        type="date"
        required
      />
      
      <FormField label="Department" name="department" required>
        <select
          name="department"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select department</option>
          <option value="Production">Production</option>
          <option value="Technical">Technical</option>
          <option value="Operations">Operations</option>
          <option value="Marketing">Marketing</option>
        </select>
      </FormField>
      
      <FormField label="Requirements" name="requirements">
        <textarea
          name="requirements"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter detailed requirements"
          required
        />
      </FormField>
      
      <FormField label="Evaluation Criteria" name="evaluationCriteria">
        <textarea
          name="evaluationCriteria"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter evaluation criteria"
        />
      </FormField>
      
      <FormField label="Documents" name="documents">
        <input
          type="file"
          name="documents"
          multiple
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}