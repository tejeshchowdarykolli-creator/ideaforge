import React from 'react';
import { Check } from 'lucide-react';

export default function ProgressIndicator({ currentStep }) {
  // Steps: 1: Idea, 2: Focus, 3: Scope, 4: Plan
  const steps = [
    { id: 1, key: 'idea', label: 'Idea' },
    { id: 2, key: 'focus', label: 'Focus' },
    { id: 3, key: 'scope', label: 'Scope' },
    { id: 4, key: 'plan', label: 'Plan' },
  ];

  const getStepNumber = () => {
    switch (currentStep) {
      case 'input':
        return 1;
      case 'question-outcome':
        return 2;
      case 'question-audience':
        return 3;
      case 'transition':
        return 3;
      case 'snapshot':
        return 4;
      case 'build':
        return 4;
      default:
        return 1;
    }
  };

  const activeNum = getStepNumber();

  return (
    <div className="flex items-center justify-center py-2" aria-label="Progress">
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs tracking-wider uppercase font-mono">
        {steps.map((step, index) => {
          const isCompleted = step.id < activeNum;
          const isCurrent = step.id === activeNum;
          const isFuture = step.id > activeNum;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-charcoal text-warm-bg'
                      : isCurrent
                      ? 'bg-accent text-white'
                      : 'border border-warm-border text-charcoal-soft bg-warm-canvas'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : step.id}
                </span>
                <span
                  className={`text-xs transition-colors duration-200 ${
                    isCurrent
                      ? 'text-charcoal font-semibold'
                      : isCompleted
                      ? 'text-charcoal-muted'
                      : 'text-charcoal-soft'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`w-5 sm:w-8 h-px transition-colors duration-200 ${
                    step.id < activeNum ? 'bg-charcoal' : 'bg-warm-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
