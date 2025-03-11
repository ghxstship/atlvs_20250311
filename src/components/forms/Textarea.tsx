import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'w-full px-3 py-2 border rounded-lg text-mono-900 placeholder-mono-400',
          'focus:ring-2 focus:ring-mono-500 focus:border-mono-500',
          'disabled:bg-mono-50 disabled:text-mono-500',
          'transition duration-200',
          'sm:text-sm',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          !error && 'border-mono-300',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;