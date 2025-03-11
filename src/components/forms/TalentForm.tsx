import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormWrapper } from '../../lib/form-context';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import FormField from './FormField';
import FormActions from './FormActions';

const talentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  event: z.string().min(1, 'Event is required'),
  fee: z.number().min(0, 'Fee must be a positive number'),
  performanceDate: z.string().min(1, 'Performance date is required'),
  performanceTime: z.string().min(1, 'Performance time is required'),
  duration: z.number().min(1, 'Duration is required'),
  requirements: z.string().optional()
});

type TalentFormData = z.infer<typeof talentSchema>;

interface TalentFormProps {
  onSubmit: (data: TalentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const roleOptions = [
  { value: '', label: 'Select role' },
  { value: 'keynote', label: 'Keynote Speaker' },
  { value: 'band', label: 'Band' },
  { value: 'mc', label: 'MC' },
  { value: 'dj', label: 'DJ' },
  { value: 'performer', label: 'Performer' }
];

const eventOptions = [
  { value: '', label: 'Select event' },
  { value: '1', label: 'Tech Conference 2024' },
  { value: '2', label: 'Music Festival' },
  { value: '3', label: 'Corporate Summit' }
];

export default function TalentForm({ onSubmit, onCancel, isSubmitting }: TalentFormProps) {
  const form = useForm<TalentFormData>({
    resolver: zodResolver(talentSchema),
    defaultValues: {
      name: '',
      role: '',
      event: '',
      fee: 0,
      performanceDate: '',
      performanceTime: '',
      duration: 0,
      requirements: ''
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <FormWrapper form={form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Name"
          name="name"
          required
        >
          <Input placeholder="Enter talent name" {...form.register('name')} />
        </FormField>
        
        <FormField
          label="Role"
          name="role"
          required
        >
          <Select options={roleOptions} {...form.register('role')} />
        </FormField>
        
        <FormField
          label="Event"
          name="event"
          required
        >
          <Select options={eventOptions} {...form.register('event')} />
        </FormField>
        
        <FormField
          label="Fee"
          name="fee"
          required
        >
          <Input 
            type="number" 
            placeholder="Enter fee amount" 
            {...form.register('fee', { valueAsNumber: true })} 
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Performance Date"
            name="performanceDate"
            required
          >
            <Input type="date" {...form.register('performanceDate')} />
          </FormField>
          
          <FormField
            label="Performance Time"
            name="performanceTime"
            required
          >
            <Input type="time" {...form.register('performanceTime')} />
          </FormField>
        </div>
        
        <FormField
          label="Duration (minutes)"
          name="duration"
          required
        >
          <Input 
            type="number" 
            placeholder="Enter performance duration" 
            {...form.register('duration', { valueAsNumber: true })} 
          />
        </FormField>
        
        <FormField
          label="Requirements"
          name="requirements"
        >
          <Textarea 
            rows={4}
            placeholder="Enter technical requirements or rider details"
            {...form.register('requirements')}
          />
        </FormField>

        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          submitLabel="Save Talent"
        />
      </form>
    </FormWrapper>
  );
}