import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormWrapper } from '../../lib/form-context';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import FormField from './FormField';
import FormActions from './FormActions';
import { phoneRegex, fileSchema } from '../../lib/validation';
import { Upload, Linkedin, Twitter, Instagram, Facebook, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Maximum file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];

const companySchema = z.object({
  name: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name cannot exceed 100 characters'),
  address: z.string()
    .min(1, 'Address is required'),
  city: z.string()
    .min(1, 'City is required'),
  state: z.string()
    .min(1, 'State/Province is required'),
  postalCode: z.string()
    .min(1, 'Postal code is required'),
  country: z.string()
    .min(1, 'Country is required'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  companyType: z.string()
    .min(1, 'Company type is required'),
  taxId: z.string()
    .min(1, 'Tax ID/Registration number is required'),
  foundedDate: z.string()
    .min(1, 'Founded date is required'),
  employeeCount: z.number()
    .min(1, 'Number of employees is required'),
  industryClassification: z.string()
    .min(1, 'Industry classification is required'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  logo: fileSchema(MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES),
  socialMedia: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
    facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal(''))
  }).optional(),
  isDraft: z.boolean().optional()
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CompanyFormData>;
}

const companyTypeOptions = [
  { value: '', label: 'Select company type' },
  { value: 'production', label: 'Production Company' },
  { value: 'equipment', label: 'Equipment Supplier' },
  { value: 'service', label: 'Service Provider' },
  { value: 'venue', label: 'Venue' }
];

const industryOptions = [
  { value: '', label: 'Select industry' },
  { value: 'live_events', label: 'Live Events' },
  { value: 'music', label: 'Music Industry' },
  { value: 'theater', label: 'Theater & Performing Arts' },
  { value: 'corporate', label: 'Corporate Events' },
  { value: 'sports', label: 'Sports & Recreation' },
  { value: 'entertainment', label: 'Entertainment' }
];

const countryOptions = [
  { value: '', label: 'Select country' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' }
];

export default function CompanyForm({ onSubmit, onCancel, isSubmitting, initialData }: CompanyFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      website: initialData?.website || '',
      companyType: initialData?.companyType || '',
      taxId: initialData?.taxId || '',
      foundedDate: initialData?.foundedDate || '',
      employeeCount: initialData?.employeeCount || 0,
      industryClassification: initialData?.industryClassification || '',
      description: initialData?.description || '',
      socialMedia: initialData?.socialMedia || {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      },
      isDraft: initialData?.isDraft || false
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.svg']
    },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        const file = acceptedFiles[0];
        form.setValue('logo', file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Validate image dimensions
        const img = new Image();
        img.onload = () => {
          if (img.width < 200 || img.height < 200) {
            form.setError('logo', {
              type: 'manual',
              message: 'Image dimensions must be at least 200x200 pixels'
            });
          }
        };
        img.src = URL.createObjectURL(file);
      }
    }
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      form.reset();
      setLogoPreview(null);
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
            label="Company Name"
            name="name"
            required
            description="Enter the official registered name of your company"
          >
            <Input 
              placeholder="Enter company name"
              maxLength={100}
              {...form.register('name')}
            />
          </FormField>

          <FormField
            label="Company Type"
            name="companyType"
            required
          >
            <Select 
              options={companyTypeOptions}
              {...form.register('companyType')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Founded Date"
              name="foundedDate"
              type="date"
              required
            >
              <Input {...form.register('foundedDate')} />
            </FormField>

            <FormField
              label="Number of Employees"
              name="employeeCount"
              type="number"
              required
            >
              <Input 
                placeholder="Enter number of employees"
                min={1}
                {...form.register('employeeCount', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField
            label="Industry Classification"
            name="industryClassification"
            required
          >
            <Select 
              options={industryOptions}
              {...form.register('industryClassification')}
            />
          </FormField>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Contact Information</h3>

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
            label="Website"
            name="website"
          >
            <Input 
              type="url"
              placeholder="https://www.example.com"
              {...form.register('website')}
            />
          </FormField>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Address Information</h3>

          <FormField
            label="Street Address"
            name="address"
            required
          >
            <Textarea 
              placeholder="Enter street address"
              rows={2}
              {...form.register('address')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="City"
              name="city"
              required
            >
              <Input 
                placeholder="Enter city"
                {...form.register('city')}
              />
            </FormField>

            <FormField
              label="State/Province"
              name="state"
              required
            >
              <Input 
                placeholder="Enter state or province"
                {...form.register('state')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Postal Code"
              name="postalCode"
              required
            >
              <Input 
                placeholder="Enter postal code"
                {...form.register('postalCode')}
              />
            </FormField>

            <FormField
              label="Country"
              name="country"
              required
            >
              <Select 
                options={countryOptions}
                {...form.register('country')}
              />
            </FormField>
          </div>
        </div>

        {/* Branding & Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Branding & Social Media</h3>

          <FormField
            label="Company Logo"
            name="logo"
            description="Upload your company logo (PNG, JPG, SVG, max 2MB, min 200x200px)"
          >
            <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-mono-300 border-dashed rounded-lg cursor-pointer hover:border-mono-400">
              <div className="space-y-1 text-center">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="mx-auto h-32 w-32 object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogoPreview(null);
                        form.setValue('logo', undefined);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-mono-400" />
                    <div className="flex text-sm text-mono-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
                        <span>Upload a file</span>
                        <input {...getInputProps()} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-mono-500">
                      PNG, JPG, SVG up to 2MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </FormField>

          <div className="space-y-4">
            <FormField
              label="LinkedIn Company Page"
              name="socialMedia.linkedin"
              icon={<Linkedin className="w-5 h-5 text-[#0A66C2]" />}
            >
              <Input 
                type="url"
                placeholder="https://www.linkedin.com/company/your-company"
                {...form.register('socialMedia.linkedin')}
              />
            </FormField>

            <FormField
              label="Twitter/X Profile"
              name="socialMedia.twitter"
              icon={<Twitter className="w-5 h-5 text-[#1DA1F2]" />}
            >
              <Input 
                type="url"
                placeholder="https://twitter.com/your-company"
                {...form.register('socialMedia.twitter')}
              />
            </FormField>

            <FormField
              label="Facebook Page"
              name="socialMedia.facebook"
              icon={<Facebook className="w-5 h-5 text-[#1877F2]" />}
            >
              <Input 
                type="url"
                placeholder="https://www.facebook.com/your-company"
                {...form.register('socialMedia.facebook')}
              />
            </FormField>

            <FormField
              label="Instagram Profile"
              name="socialMedia.instagram"
              icon={<Instagram className="w-5 h-5 text-[#E4405F]" />}
            >
              <Input 
                type="url"
                placeholder="https://www.instagram.com/your-company"
                {...form.register('socialMedia.instagram')}
              />
            </FormField>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Business Information</h3>

          <FormField
            label="Tax ID/Registration Number"
            name="taxId"
            required
          >
            <Input 
              placeholder="Enter tax ID or registration number"
              {...form.register('taxId')}
            />
          </FormField>

          <FormField
            label="Company Description"
            name="description"
            description="Briefly describe your company's services and expertise (max 500 characters)"
          >
            <Textarea 
              placeholder="Enter company description"
              rows={4}
              maxLength={500}
              {...form.register('description')}
            />
          </FormField>
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
            submitLabel="Register Company"
          />
        </div>
      </form>
    </FormWrapper>
  );
}