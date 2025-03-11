import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center">
        <div className="relative flex items-center">
          <input
            type="radio"
            className={cn(
              'w-5 h-5 border rounded-full',
              'text-mono-900 border-mono-300',
              'focus:ring-2 focus:ring-mono-500',
              error && 'border-red-300',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {label && (
          <span className="ml-2 text-sm text-mono-700">{label}</span>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;