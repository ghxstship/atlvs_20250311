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
import { Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { phoneRegex } from '../../lib/validation';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const crewSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  photo: z.any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, and .png formats are supported'
    )
    .optional(),
  personalEmail: z.string().min(1, 'Personal email is required').email('Invalid email address'),
  mobilePhone: z.string().min(1, 'Mobile phone is required').regex(phoneRegex, 'Invalid phone number format'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  governmentId: z.string().min(1, 'Government ID/Passport number is required'),
  nationality: z.string().min(1, 'Nationality is required'),

  // Professional Details
  employeeId: z.string().min(1, 'Employee ID is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  workEmail: z.string().min(1, 'Work email is required').email('Invalid email address'),
  certifications: z.array(z.object({
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    document: z.any().optional()
  })),
  language: z.string().min(1, 'Primary language is required'),
  languageProficiency: z.enum(['Basic', 'Intermediate', 'Fluent', 'Native']),

  // Uniform & Equipment
  shirtSize: z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']),
  pantsSize: z.string().min(1, 'Pants size is required'),
  shoeSize: z.string().min(1, 'Shoe size is required'),
  additionalEquipment: z.string().optional(),

  // Health & Safety
  dietaryRestrictions: z.string().optional(),
  medicalConditions: z.string().optional(),

  // Primary Emergency Contact
  emergencyContact1: z.object({
    name: z.string().min(1, 'Contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Phone number is required').regex(phoneRegex, 'Invalid phone number format'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string().min(1, 'Address is required')
  }),

  // Secondary Emergency Contact (optional)
  emergencyContact2: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string()
  }).optional(),

  // System Fields
  signature: z.string().min(1, 'Digital signature is required'),
  privacyConsent: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
  dataAccuracy: z.boolean().refine(val => val === true, 'You must confirm the accuracy of the information')
});

type CrewFormData = z.infer<typeof crewSchema>;

interface CrewFormProps {
  onSubmit: (data: CrewFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CrewFormData>;
}

const countryOptions = [
  { value: '', label: 'Select country' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' }
];

const languageProficiencyOptions = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Native', label: 'Native' }
];

const shirtSizeOptions = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: '2XL', label: '2XL' },
  { value: '3XL', label: '3XL' }
];

export default function CrewForm({ onSubmit, onCancel, isSubmitting, initialData }: CrewFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const form = useForm<CrewFormData>({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      middleName: initialData?.middleName || '',
      lastName: initialData?.lastName || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      personalEmail: initialData?.personalEmail || '',
      mobilePhone: initialData?.mobilePhone || '',
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || '',
      governmentId: initialData?.governmentId || '',
      nationality: initialData?.nationality || '',
      employeeId: initialData?.employeeId || '',
      hireDate: initialData?.hireDate || '',
      department: initialData?.department || '',
      position: initialData?.position || '',
      workEmail: initialData?.workEmail || '',
      certifications: initialData?.certifications || [],
      language: initialData?.language || '',
      languageProficiency: initialData?.languageProficiency || 'Basic',
      shirtSize: initialData?.shirtSize || 'M',
      pantsSize: initialData?.pantsSize || '',
      shoeSize: initialData?.shoeSize || '',
      additionalEquipment: initialData?.additionalEquipment || '',
      dietaryRestrictions: initialData?.dietaryRestrictions || '',
      medicalConditions: initialData?.medicalConditions || '',
      emergencyContact1: initialData?.emergencyContact1 || {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        address: ''
      },
      emergencyContact2: initialData?.emergencyContact2,
      privacyConsent: false,
      dataAccuracy: false
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        const file = acceptedFiles[0];
        form.setValue('photo', file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      form.reset();
      setPhotoPreview(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <FormWrapper form={form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="First Name"
              name="firstName"
              required
            >
              <Input placeholder="Enter first name" {...form.register('firstName')} />
            </FormField>

            <FormField
              label="Middle Name"
              name="middleName"
            >
              <Input placeholder="Enter middle name" {...form.register('middleName')} />
            </FormField>

            <FormField
              label="Last Name"
              name="lastName"
              required
            >
              <Input placeholder="Enter last name" {...form.register('lastName')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
            >
              <Input {...form.register('dateOfBirth')} />
            </FormField>

            <FormField
              label="Nationality"
              name="nationality"
              required
            >
              <Select 
                options={countryOptions}
                {...form.register('nationality')}
              />
            </FormField>
          </div>

          <FormField
            label="Profile Photo"
            name="photo"
            description="Upload a professional photo (JPEG/PNG, max 5MB)"
          >
            <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-mono-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoPreview(null);
                        form.setValue('photo', undefined);
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
                      PNG, JPG up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Personal Email"
              name="personalEmail"
              type="email"
              required
            >
              <Input placeholder="Enter personal email" {...form.register('personalEmail')} />
            </FormField>

            <FormField
              label="Mobile Phone"
              name="mobilePhone"
              required
            >
              <Input placeholder="+1 (555) 123-4567" {...form.register('mobilePhone')} />
            </FormField>
          </div>

          <FormField
            label="Address Line 1"
            name="addressLine1"
            required
          >
            <Input placeholder="Enter street address" {...form.register('addressLine1')} />
          </FormField>

          <FormField
            label="Address Line 2"
            name="addressLine2"
          >
            <Input placeholder="Apartment, suite, unit, etc." {...form.register('addressLine2')} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="City"
              name="city"
              required
            >
              <Input placeholder="Enter city" {...form.register('city')} />
            </FormField>

            <FormField
              label="State/Province"
              name="state"
              required
            >
              <Input placeholder="Enter state or province" {...form.register('state')} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Postal Code"
              name="postalCode"
              required
            >
              <Input placeholder="Enter postal code" {...form.register('postalCode')} />
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

          <FormField
            label="Government ID/Passport Number"
            name="governmentId"
            required
          >
            <Input placeholder="Enter ID number" {...form.register('governmentId')} />
          </FormField>
        </div>

        {/* Professional Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Professional Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Employee ID"
              name="employeeId"
              required
            >
              <Input placeholder="Enter employee ID" {...form.register('employeeId')} />
            </FormField>

            <FormField
              label="Hire Date"
              name="hireDate"
              type="date"
              required
            >
              <Input {...form.register('hireDate')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Department"
              name="department"
              required
            >
              <Input placeholder="Enter department" {...form.register('department')} />
            </FormField>

            <FormField
              label="Position/Role"
              name="position"
              required
            >
              <Input placeholder="Enter position" {...form.register('position')} />
            </FormField>
          </div>

          <FormField
            label="Work Email"
            name="workEmail"
            type="email"
            required
          >
            <Input placeholder="Enter work email" {...form.register('workEmail')} />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Primary Language"
              name="language"
              required
            >
              <Input placeholder="Enter primary language" {...form.register('language')} />
            </FormField>

            <FormField
              label="Language Proficiency"
              name="languageProficiency"
              required
            >
              <Select 
                options={languageProficiencyOptions}
                {...form.register('languageProficiency')}
              />
            </FormField>
          </div>
        </div>

        {/* Uniform & Equipment */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Uniform & Equipment</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Shirt Size"
              name="shirtSize"
              required
            >
              <Select options={shirtSizeOptions} {...form.register('shirtSize')} />
            </FormField>

            <FormField
              label="Pants Size"
              name="pantsSize"
              required
            >
              <Input placeholder="Enter pants size" {...form.register('pantsSize')} />
            </FormField>

            <FormField
              label="Shoe Size"
              name="shoeSize"
              required
            >
              <Input placeholder="Enter shoe size" {...form.register('shoeSize')} />
            </FormField>
          </div>

          <FormField
            label="Additional Equipment Requirements"
            name="additionalEquipment"
          >
            <Textarea 
              placeholder="Enter any additional equipment needs"
              rows={3}
              {...form.register('additionalEquipment')}
            />
          </FormField>
        </div>

        {/* Health & Safety */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Health & Safety</h3>

          <FormField
            label="Dietary Restrictions/Allergies"
            name="dietaryRestrictions"
          >
            <Textarea 
              placeholder="Enter any dietary restrictions or allergies"
              rows={2}
              {...form.register('dietaryRestrictions')}
            />
          </FormField>

          <FormField
            label="Medical Conditions"
            name="medicalConditions"
            description="List any medical conditions relevant to work"
          >
            <Textarea 
              placeholder="Enter relevant medical conditions"
              rows={2}
              {...form.register('medicalConditions')}
            />
          </FormField>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Emergency Contacts</h3>
          <p className="text-sm text-mono-500">Primary emergency contact is required</p>

          {/* Primary Emergency Contact */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="text-sm font-medium text-mono-900">Primary Emergency Contact</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="emergencyContact1.name"
                required
              >
                <Input 
                  placeholder="Enter contact name"
                  {...form.register('emergencyContact1.name')}
                />
              </FormField>

              <FormField
                label="Relationship"
                name="emergencyContact1.relationship"
                required
              >
                <Input 
                  placeholder="Enter relationship"
                  {...form.register('emergencyContact1.relationship')}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Phone Number"
                name="emergencyContact1.phone"
                required
              >
                <Input 
                  placeholder="+1 (555) 123-4567"
                  {...form.register('emergencyContact1.phone')}
                />
              </FormField>

              <FormField
                label="Email Address"
                name="emergencyContact1.email"
                type="email"
              >
                <Input 
                  placeholder="Enter email address"
                  {...form.register('emergencyContact1.email')}
                />
              </FormField>
            </div>

            <FormField
              label="Physical Address"
              name="emergencyContact1.address"
              required
            >
              <Textarea 
                placeholder="Enter complete address"
                rows={2}
                {...form.register('emergencyContact1.address')}
              />
            </FormField>
          </div>

          {/* Secondary Emergency Contact (Optional) */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="text-sm font-medium text-mono-900">Secondary Emergency Contact (Optional)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="emergencyContact2.name"
              >
                <Input 
                  placeholder="Enter contact name"
                  {...form.register('emergencyContact2.name')}
                />
              </FormField>

              <FormField
                label="Relationship"
                name="emergencyContact2.relationship"
              >
                <Input 
                  placeholder="Enter relationship"
                  {...form.register('emergencyContact2.relationship')}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Phone Number"
                name="emergencyContact2.phone"
              >
                <Input 
                  placeholder="+1 (555) 123-4567"
                  {...form.register('emergencyContact2.phone')}
                />
              </FormField>

              <FormField
                label="Email Address"
                name="emergencyContact2.email"
                type="email"
              >
                <Input 
                  placeholder="Enter email address"
                  {...form.register('emergencyContact2.email')}
                />
              </FormField>
            </div>

            <FormField
              label="Physical Address"
              name="emergencyContact2.address"
            >
              <Textarea 
                placeholder="Enter complete address"
                rows={2}
                {...form.register('emergencyContact2.address')}
              />
            </FormField>
          </div>
        </div>

        {/* Agreements & Signature */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Agreements & Signature</h3>

          <FormField
            label="Digital Signature"
            name="signature"
            required
            description="Type your full legal name as your digital signature"
          >
            <Input 
              placeholder="Enter your full legal name"
              {...form.register('signature')}
            />
          </FormField>

          <div className="space-y-2">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                {...form.register('privacyConsent')}
              />
              <span className="ml-2 text-sm text-mono-600">
                I consent to the collection and processing of my personal information in accordance with the{' '}
                <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                {...form.register('dataAccuracy')}
              />
              <span className="ml-2 text-sm text-mono-600">
                I confirm that all information provided is accurate and complete to the best of my knowledge.
              </span>
            </label>
          </div>
        </div>

        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel="Submit Crew Information"
        />
      </form>
    </FormWrapper>
  );
}