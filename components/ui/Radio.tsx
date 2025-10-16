import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, className, id, ...props }, ref) => {
    const radioId = id || `${props.name}-${props.value}`;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={cn(
              'h-4 w-4 border-border text-primary-500 transition-colors',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={radioId}
            className="font-medium text-neutral-700 cursor-pointer"
          >
            {label}
          </label>
          {helperText && (
            <p className="text-neutral-500 mt-0.5">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
