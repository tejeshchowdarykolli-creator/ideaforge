import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';

export default function ProgressTransition({ onComplete, isAnalysisDone }) {
  const steps = [
    { id: 1, label: 'Understanding your idea' },
    { id: 2, label: 'Finding the main problem' },
    { id: 3, label: 'Checking scope' },
    { id: 4, label: 'Preparing your next step' },
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    // Step smoothly through the 4 meaningful stages
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // When all steps are walked through AND analysis data is ready, transition to snapshot
    if (activeStepIndex === steps.length - 1 && isAnalysisDone) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [activeStepIndex, isAnalysisDone, onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 text-center animate-step-fade">
      <div className="mb-8">
        <ProgressIndicator currentStep="transition" />
      </div>

      <div className="my-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-charcoal">
          YOUR IDEA IS TAKING SHAPE
        </h2>
        <p className="mt-1 text-xs text-charcoal-muted">
          Distilling problem statements, wedge differentiation, and MVP scope.
        </p>
      </div>

      {/* Meaningful progress step list */}
      <div className="mt-8 border border-warm-border rounded-lg bg-warm-canvas p-6 text-left max-w-md mx-auto space-y-3.5">
        {steps.map((step, idx) => {
          const isDone = idx < activeStepIndex || (idx === steps.length - 1 && isAnalysisDone);
          const isCurrent = idx === activeStepIndex && !isDone;
          const isPending = idx > activeStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                isDone
                  ? 'text-charcoal'
                  : isCurrent
                  ? 'text-accent font-medium'
                  : 'text-charcoal-soft/50'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-charcoal text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-warm-border" />
                )}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
