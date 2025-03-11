import React, { useState } from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface OnboardingFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Mock applicants data - in a real app this would come from your database
const applicants = [
  { 
    id: 1, 
    name: 'John Smith',
    position: 'Audio Technician',
    experience: '5 years',
    email: 'john.smith@example.com',
    status: 'Under Review'
  },
  { 
    id: 2, 
    name: 'Emily Brown',
    position: 'Stage Manager',
    experience: '8 years',
    email: 'emily.brown@example.com',
    status: 'Interview Scheduled'
  },
  { 
    id: 3, 
    name: 'James Wilson',
    position: 'Lighting Designer',
    experience: '3 years',
    email: 'james.wilson@example.com',
    status: 'New'
  }
];

const onboardingTemplates = {
  'technical': {
    name: 'Technical Staff Template',
    tasks: [
      { id: 1, task: 'Safety Training', required: true },
      { id: 2, task: 'Equipment Operation Training', required: true },
      { id: 3, task: 'Software Systems Introduction', required: true },
      { id: 4, task: 'Team Introduction', required: true },
      { id: 5, task: 'Project Management Tools Training', required: false },
      { id: 6, task: 'Department Procedures Review', required: true }
    ]
  },
  'production': {
    name: 'Production Staff Template',
    tasks: [
      { id: 1, task: 'Production Workflow Training', required: true },
      { id: 2, task: 'Communication Protocols', required: true },
      { id: 3, task: 'Event Planning Overview', required: true },
      { id: 4, task: 'Team Introduction', required: true },
      { id: 5, task: 'Client Relations Training', required: false },
      { id: 6, task: 'Budget Management Training', required: false }
    ]
  },
  'management': {
    name: 'Management Template',
    tasks: [
      { id: 1, task: 'Leadership Training', required: true },
      { id: 2, task: 'HR Policies Review', required: true },
      { id: 3, task: 'Budget Management', required: true },
      { id: 4, task: 'Team Management Tools', required: true },
      { id: 5, task: 'Strategic Planning Overview', required: true },
      { id: 6, task: 'Performance Management Training', required: true }
    ]
  }
};

export default function OnboardingForm({ onSubmit, onCancel, isSubmitting }: OnboardingFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState('');

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };

  const handleApplicantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApplicant(e.target.value);
    // You could auto-fill other fields based on the selected applicant here
  };

  const addCustomTask = () => {
    setCustomTasks([...customTasks, '']);
  };

  const updateCustomTask = (index: number, value: string) => {
    const newTasks = [...customTasks];
    newTasks[index] = value;
    setCustomTasks(newTasks);
  };

  return (
    <form onSubmit={onSubmit}>
      <FormField label="Applicant" name="applicant" required>
        <select
          name="applicant"
          value={selectedApplicant}
          onChange={handleApplicantChange}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select applicant</option>
          {applicants.map(applicant => (
            <option key={applicant.id} value={applicant.id}>
              {applicant.name} - {applicant.position} ({applicant.experience})
            </option>
          ))}
        </select>
      </FormField>

      {selectedApplicant && (
        <>
          <FormField label="Position" name="position" required>
            <select
              name="position"
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
              defaultValue={applicants.find(a => a.id.toString() === selectedApplicant)?.position || ''}
            >
              <option value="">Select position</option>
              <option value="Audio Technician">Audio Technician</option>
              <option value="Stage Hand">Stage Hand</option>
              <option value="Lighting Assistant">Lighting Assistant</option>
              <option value="Production Assistant">Production Assistant</option>
            </select>
          </FormField>
          
          <FormField
            label="Start Date"
            name="startDate"
            type="date"
            required
          />
          
          <FormField label="Mentor" name="mentor" required>
            <select
              name="mentor"
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            >
              <option value="">Select mentor</option>
              <option value="Mike Thompson">Mike Thompson</option>
              <option value="Sarah Chen">Sarah Chen</option>
              <option value="David Wilson">David Wilson</option>
            </select>
          </FormField>
          
          <FormField label="Department" name="department" required>
            <select
              name="department"
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            >
              <option value="">Select department</option>
              <option value="Production">Production</option>
              <option value="Technical">Technical</option>
              <option value="Audio">Audio</option>
              <option value="Lighting">Lighting</option>
            </select>
          </FormField>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-mono-700">
              Onboarding Template
            </label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            >
              <option value="">Select a template</option>
              <option value="technical">Technical Staff Template</option>
              <option value="production">Production Staff Template</option>
              <option value="management">Management Template</option>
            </select>
          </div>

          {selectedTemplate && (
            <div className="mb-6">
              <h3 className="font-medium text-mono-900 mb-3">Template Tasks</h3>
              <div className="space-y-2">
                {onboardingTemplates[selectedTemplate as keyof typeof onboardingTemplates].tasks.map(task => (
                  <div key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={task.required}
                      className="mr-2"
                    />
                    <span className="text-mono-600">
                      {task.task}
                      {task.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-mono-900">Custom Tasks</h3>
              <button
                type="button"
                onClick={addCustomTask}
                className="text-sm text-mono-600 hover:text-accent"
              >
                + Add Task
              </button>
            </div>
            <div className="space-y-2">
              {customTasks.map((task, index) => (
                <input
                  key={index}
                  type="text"
                  value={task}
                  onChange={(e) => updateCustomTask(index, e.target.value)}
                  placeholder="Enter custom task"
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                />
              ))}
            </div>
          </div>

          <FormField label="Additional Notes" name="notes">
            <textarea
              name="notes"
              rows={4}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter any additional notes or requirements"
            />
          </FormField>
        </>
      )}

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}