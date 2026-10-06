import React, { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';

const STEPS = [
  { label: "Understanding your idea", detail: "Parsing core concept and target persona" },
  { label: "Finding the main problem", detail: "Checking market friction and competitor gaps" },
  { label: "Checking scope & risks", detail: "Identifying execution hurdles and must-have MVP boundaries" },
  { label: "Preparing your workspace", detail: "Selecting optimal direction and architecture" },
];

export default function AnalyzingState() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 700);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 1400);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border border-warm-border bg-warm-canvas p-6 shadow-2xs animate-step-fade">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-warm-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal text-white shadow-2xs">
            <Loader2 className="h-4 w-4 animate-spin text-warm-bg" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-charcoal">IdeaForge Guide</h3>
            <p className="text-xs text-charcoal-muted">Analyzing concept & configuring workspace...</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-accent font-medium">
          Step {currentStepIndex + 1} of 4
        </span>
      </div>

      {/* Meaningful Steps List (No fake percentages) */}
      <div className="mt-5 space-y-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.label}
              className={`flex items-start gap-3 rounded-lg p-2.5 transition-all duration-200 ${
                isCurrent ? 'bg-warm-panel/60 border border-warm-border/70' : ''
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-all ${
                  isDone
                    ? 'border-charcoal bg-charcoal text-white'
                    : isCurrent
                    ? 'border-accent bg-warm-canvas text-accent ring-2 ring-accent/15'
                    : 'border-warm-border bg-warm-canvas text-charcoal-soft'
                }`}
              >
                {isDone ? (
                  <Check className="h-3 w-3 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="h-3 w-3 animate-spin text-accent" />
                ) : (
                  <span className="font-mono text-[10px]">{idx + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'text-charcoal font-semibold'
                      : isDone
                      ? 'text-charcoal-muted'
                      : 'text-charcoal-soft/70'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-charcoal-soft leading-tight mt-0.5">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
