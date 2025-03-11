import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ContactFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ContactForm({ onSubmit, onCancel, isSubmitting }: ContactFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Name"
        name="name"
        placeholder="Enter contact name"
        required
      />
      
      <FormField label="Company" name="company" required>
        <select
          name="company"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select company</option>
          <option value="Stage Systems Inc.">Stage Systems Inc.</option>
          <option value="Sound Solutions Ltd">Sound Solutions Ltd</option>
          <option value="Event Tech Pro">Event Tech Pro</option>
        </select>
      </FormField>
      
      <FormField label="Role" name="role" required>
        <select
          name="role"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select role</option>
          <option value="Sales Director">Sales Director</option>
          <option value="Account Manager">Account Manager</option>
          <option value="Technical Director">Technical Director</option>
          <option value="Project Manager">Project Manager</option>
        </select>
      </FormField>
      
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email address"
        required
      />
      
      <FormField
        label="Phone"
        name="phone"
        type="tel"
        placeholder="Enter phone number"
        required
      />
      
      <FormField
        label="Mobile"
        name="mobile"
        type="tel"
        placeholder="Enter mobile number"
      />
      
      <FormField label="Department" name="department">
        <select
          name="department"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select department</option>
          <option value="Sales">Sales</option>
          <option value="Technical">Technical</option>
          <option value="Support">Support</option>
          <option value="Management">Management</option>
        </select>
      </FormField>
      
      <FormField
        label="Address"
        name="address"
        placeholder="Enter business address"
      />
      
      <FormField label="Notes" name="notes">
        <textarea
          name="notes"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any additional notes"
        />
      </FormField>
      
      <FormField label="Photo" name="photo">
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}