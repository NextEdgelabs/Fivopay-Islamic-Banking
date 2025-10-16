import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className,
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col', className)}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full border-2 font-semibold transition-colors',
                    isCompleted && 'bg-primary-500 border-primary-500 text-white',
                    isCurrent && 'border-primary-500 text-primary-600',
                    !isCompleted && !isCurrent && 'border-neutral-300 text-neutral-500'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 h-16 my-2',
                      isCompleted ? 'bg-primary-500' : 'bg-neutral-200'
                    )}
                  />
                )}
              </div>
              <div className={cn('flex-1', !isLast && 'pb-16')}>
                <h4
                  className={cn(
                    'text-sm font-semibold',
                    isCurrent && 'text-primary-600',
                    !isCurrent && 'text-neutral-700'
                  )}
                >
                  {step.label}
                </h4>
                {step.description && (
                  <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center h-10 w-10 rounded-full border-2 font-semibold transition-colors',
                  isCompleted && 'bg-primary-500 border-primary-500 text-white',
                  isCurrent && 'border-primary-500 text-primary-600',
                  !isCompleted && !isCurrent && 'border-neutral-300 text-neutral-500'
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
              </div>
              <div className="mt-2 text-center">
                <h4
                  className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-primary-600',
                    !isCurrent && 'text-neutral-700'
                  )}
                >
                  {step.label}
                </h4>
                {step.description && (
                  <p className="text-xs text-neutral-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 mb-6',
                  isCompleted ? 'bg-primary-500' : 'bg-neutral-200'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Stepper.displayName = 'Stepper';

export default Stepper;
