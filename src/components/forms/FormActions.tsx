import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function FormActions({
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  className,
  align = 'right'
}: FormActionsProps) {
  return (
    <div 
      className={cn(
        'flex space-x-3 mt-6',
        align === 'right' && 'justify-end',
        align === 'center' && 'justify-center',
        className
      )}
    >
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {submitLabel}
      </Button>
    </div>
  );
}