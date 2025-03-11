import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  description?: string;
  error?: string;
  hideLabel?: boolean;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className,
  children,
  description,
  error,
  hideLabel = false
}: FormFieldProps) {
  // Make form context optional to support standalone usage
  const formContext = useFormContext();
  const fieldError = formContext?.formState?.errors?.[name]?.message as string;
  const finalError = error || fieldError;

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={name}
        className={cn(
          "block text-sm font-medium text-mono-700",
          hideLabel && "sr-only"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {description && (
        <p className="text-sm text-mono-500">{description}</p>
      )}

      <div className="relative">
        {children || (
          <input
            type={type}
            id={name}
            name={name}
            {...(formContext?.register ? formContext.register(name) : {})}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 border rounded-lg text-mono-900 placeholder-mono-400',
              'focus:ring-2 focus:ring-mono-500 focus:border-mono-500',
              'disabled:bg-mono-50 disabled:text-mono-500',
              'transition duration-200',
              'sm:text-sm',
              finalError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              !finalError && 'border-mono-300'
            )}
            aria-invalid={!!finalError}
            aria-describedby={finalError ? `${name}-error` : undefined}
          />
        )}

        {finalError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {finalError && (
        <p className="text-sm text-red-600" id={`${name}-error`} role="alert">
          {finalError}
        </p>
      )}
    </div>
  );
}