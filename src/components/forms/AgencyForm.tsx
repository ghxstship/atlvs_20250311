import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormWrapper } from '../../lib/form-context';
import Input from './Input';
import Textarea from './Textarea';
import FormField from './FormField';
import FormActions from './FormActions';
import { Upload } from 'lucide-react';

// Maximum file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const agencySchema = z.object({
  name: z.string()
    .min(1, 'Agency name is required')
    .max(100, 'Agency name cannot exceed 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  contactPerson: z.string()
    .min(1, 'Primary contact person is required'),
  address: z.string()
    .min(1, 'Business address is required'),
  logo: z.any()
    .refine((file) => file?.length === 0 || file?.[0]?.size <= MAX_FILE_SIZE, 'Max file size is 2MB')
    .refine(
      (file) => file?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      'Only .jpg, .jpeg, and .png formats are supported'
    )
    .optional(),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  socialMedia: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal(''))
  }).optional(),
  services: z.array(z.string()).optional(),
  isDraft: z.boolean().optional()
});

type AgencyFormData = z.infer<typeof agencySchema>;

interface AgencyFormProps {
  onSubmit: (data: AgencyFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<AgencyFormData>;
}

export default function AgencyForm({ onSubmit, onCancel, isSubmitting, initialData }: AgencyFormProps) {
  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      contactPerson: initialData?.contactPerson || '',
      address: initialData?.address || '',
      description: initialData?.description || '',
      website: initialData?.website || '',
      socialMedia: initialData?.socialMedia || {
        linkedin: '',
        twitter: '',
        instagram: ''
      },
      services: initialData?.services || [],
      isDraft: initialData?.isDraft || false
    }
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const handleSaveAsDraft = () => {
    const currentData = form.getValues();
    onSubmit({ ...currentData, isDraft: true });
  };

  return (
    <FormWrapper form={form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Basic Information</h3>
          
          <FormField
            label="Agency Name"
            name="name"
            required
            description="Enter the official registered name of your agency"
          >
            <Input 
              placeholder="Enter agency name"
              maxLength={100}
              {...form.register('name')}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              required
            >
              <Input 
                placeholder="Enter business email"
                {...form.register('email')}
              />
            </FormField>

            <FormField
              label="Phone Number"
              name="phone"
              required
              description="Include country code (e.g., +1)"
            >
              <Input 
                placeholder="+1 (555) 123-4567"
                {...form.register('phone')}
              />
            </FormField>
          </div>

          <FormField
            label="Primary Contact Person"
            name="contactPerson"
            required
          >
            <Input 
              placeholder="Enter contact person's name"
              {...form.register('contactPerson')}
            />
          </FormField>

          <FormField
            label="Business Address"
            name="address"
            required
          >
            <Textarea 
              placeholder="Enter complete business address"
              rows={3}
              {...form.register('address')}
            />
          </FormField>
        </div>

        {/* Media & Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Media & Description</h3>

          <FormField
            label="Agency Logo"
            name="logo"
            description="Upload your agency logo (JPG/PNG, max 2MB)"
          >
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-mono-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-mono-400" />
                <div className="flex text-sm text-mono-600">
                  <label
                    htmlFor="logo"
                    className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"
                  >
                    <span>Upload a file</span>
                    <input
                      id="logo"
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png"
                      {...form.register('logo')}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-mono-500">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
          </FormField>

          <FormField
            label="Agency Description"
            name="description"
            description="Briefly describe your agency's services and expertise (max 500 characters)"
          >
            <Textarea 
              placeholder="Enter agency description"
              rows={4}
              maxLength={500}
              {...form.register('description')}
            />
          </FormField>
        </div>

        {/* Web Presence */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Web Presence</h3>

          <FormField
            label="Website"
            name="website"
          >
            <Input 
              type="url"
              placeholder="https://www.example.com"
              {...form.register('website')}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="LinkedIn"
              name="socialMedia.linkedin"
            >
              <Input 
                type="url"
                placeholder="LinkedIn URL"
                {...form.register('socialMedia.linkedin')}
              />
            </FormField>

            <FormField
              label="Twitter"
              name="socialMedia.twitter"
            >
              <Input 
                type="url"
                placeholder="Twitter URL"
                {...form.register('socialMedia.twitter')}
              />
            </FormField>

            <FormField
              label="Instagram"
              name="socialMedia.instagram"
            >
              <Input 
                type="url"
                placeholder="Instagram URL"
                {...form.register('socialMedia.instagram')}
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-mono-200">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
          >
            Save as Draft
          </button>
          
          <FormActions 
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel="Register Agency"
          />
        </div>
      </form>
    </FormWrapper>
  );
}