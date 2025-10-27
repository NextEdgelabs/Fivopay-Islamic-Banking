import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, helperText, className, id, checked, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-center justify-between">
        {(label || helperText) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                className="text-sm font-medium text-neutral-700 cursor-pointer"
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className="text-sm text-neutral-500 mt-0.5">{helperText}</p>
            )}
          </div>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => {
            if (toggleId) {
              const input = document.getElementById(toggleId) as HTMLInputElement;
              if (input) input.click();
            }
          }}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-primary-500' : 'bg-neutral-200',
            className
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        <input
          ref={ref}
          id={toggleId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          {...props}
        />
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
