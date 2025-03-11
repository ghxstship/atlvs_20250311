import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 border rounded',
              'transition-colors duration-200',
              props.checked ? 'bg-mono-900 border-mono-900' : 'bg-white border-mono-300',
              error && 'border-red-300',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <Check
              className={cn(
                'w-4 h-4 text-white transform translate-x-0.5 translate-y-0.5',
                !props.checked && 'hidden'
              )}
            />
          </div>
        </div>
        {label && (
          <span className="ml-2 text-sm text-mono-700">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;