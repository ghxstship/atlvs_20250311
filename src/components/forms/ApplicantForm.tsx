import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface ApplicantFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ApplicantForm({ onSubmit, onCancel, isSubmitting }: ApplicantFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Name"
        name="name"
        placeholder="Enter applicant name"
        required
      />
      
      <FormField label="Position" name="position" required>
        <select
          name="position"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select position</option>
          <option value="Audio Technician">Audio Technician</option>
          <option value="Stage Manager">Stage Manager</option>
          <option value="Lighting Designer">Lighting Designer</option>
          <option value="Production Assistant">Production Assistant</option>
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
        label="Experience (years)"
        name="experience"
        type="number"
        placeholder="Enter years of experience"
        required
      />
      
      <FormField label="Resume" name="resume">
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        />
      </FormField>
      
      <FormField label="Portfolio" name="portfolio">
        <input
          type="url"
          name="portfolio"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter portfolio URL (optional)"
        />
      </FormField>
      
      <FormField label="Cover Letter" name="coverLetter">
        <textarea
          name="coverLetter"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter cover letter"
          required
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}