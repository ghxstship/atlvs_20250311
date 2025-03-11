import { z } from 'zod';

export const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .regex(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Name can only contain letters and spaces')
  .transform(name => name.trim());

export const companyNameSchema = z.string()
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name cannot exceed 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_.&]+$/, 'Company name contains invalid characters')
  .transform(name => name.trim());

export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(phoneRegex, 'Invalid phone number format');

export const urlSchema = z.string()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

export const fileSchema = (maxSize: number, acceptedTypes: string[]) => 
  z.any()
    .refine((file) => !file || file?.size <= maxSize, `Max file size is ${maxSize / (1024 * 1024)}MB`)
    .refine(
      (file) => !file || acceptedTypes.includes(file?.type),
      `Only ${acceptedTypes.join(', ')} formats are supported`
    )
    .optional();

export const socialMediaSchema = z.object({
  linkedin: urlSchema,
  twitter: urlSchema,
  instagram: urlSchema
}).optional();

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: phoneSchema,
  email: emailSchema.optional(),
  address: z.string().min(1, 'Address is required')
});

export const validateInput = <T>(schema: z.ZodType<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Validation failed' };
  }
};