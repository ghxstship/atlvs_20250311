import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  icon?: React.ReactNode;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, icon, options, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={cn(
            'w-full px-3 py-2 border rounded-lg text-mono-900',
            'focus:ring-2 focus:ring-mono-500 focus:border-mono-500',
            'disabled:bg-mono-50 disabled:text-mono-500',
            'transition duration-200',
            'sm:text-sm',
            'appearance-none',
            icon && 'pl-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            !error && 'border-mono-300',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-mono-400" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;