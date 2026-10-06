import React, { useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';

export default function GuidedQuestion({
  step, // 'outcome' or 'audience'
  idea,
  goal,
  onSelectAnswer,
  onBack,
}) {
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Helper to get contextual outcomes based on idea text
  const getOutcomeOptions = (text) => {
    const lower = (text || '').toLowerCase();

    if (lower.includes('intern') || lower.includes('job') || lower.includes('career')) {
      return [
        { id: 'find-matches', label: 'Help students find better verified internships' },
        { id: 'automate-apps', label: 'Automate personalized resume tailoring & applications' },
        { id: 'alumni-network', label: 'Connect candidates with alumni mentors & recruiters' },
        { id: 'not-sure', label: "I'm not sure yet" },
      ];
    }

    if (lower.includes('note') || lower.includes('study') || lower.includes('course') || lower.includes('academic')) {
      return [
        { id: 'find-notes', label: 'Help students find better notes' },
        { id: 'reward-creators', label: 'Reward students who create good notes' },
        { id: 'trusted-community', label: 'Create a trusted academic community' },
        { id: 'not-sure', label: "I'm not sure yet" },
      ];
    }

    if (lower.includes('code') || lower.includes('pr') || lower.includes('dev') || lower.includes('github')) {
      return [
        { id: 'catch-bugs', label: 'Catch critical bugs and vulnerabilities before merge' },
        { id: 'speed-review', label: 'Speed up review turnaround time for developers' },
        { id: 'enforce-standards', label: 'Enforce team coding standards automatically' },
        { id: 'not-sure', label: "I'm not sure yet" },
      ];
    }

    if (lower.includes('crop') || lower.includes('farm') || lower.includes('plant') || lower.includes('agri')) {
      return [
        { id: 'offline-detection', label: 'Detect crop disease early without internet connection' },
        { id: 'treatment-guide', label: 'Provide actionable localized treatment remedies' },
        { id: 'fair-market', label: 'Connect growers directly with verified market buyers' },
        { id: 'not-sure', label: "I'm not sure yet" },
      ];
    }

    // Default universal options
    return [
      { id: 'solve-friction', label: 'Solve the primary friction faster than existing tools' },
      { id: 'automate-workflow', label: 'Automate a manual or repetitive workflow end-to-end' },
      { id: 'trusted-marketplace', label: 'Create a trusted community or exchange platform' },
      { id: 'not-sure', label: "I'm not sure yet" },
    ];
  };

  const audienceOptions = [
    { id: 'college', label: 'College students' },
    { id: 'school', label: 'School students' },
    { id: 'teachers-students', label: 'Teachers + students' },
    { id: 'anyone', label: 'Anyone' },
  ];

  const isOutcome = step === 'outcome';
  const questionTitle = isOutcome
    ? 'WHAT IS THE MAIN OUTCOME?'
    : 'WHO ARE YOU BUILDING THIS FOR?';

  const introText = isOutcome ? (
    <div className="mb-6 space-y-1">
      <p className="text-sm font-medium text-charcoal">Good starting point.</p>
      <p className="text-sm text-charcoal-muted">
        Before we shape it, let's decide what matters most.
      </p>
    </div>
  ) : (
    <div className="mb-6 space-y-1">
      <p className="text-sm font-medium text-charcoal">Clear outcome.</p>
      <p className="text-sm text-charcoal-muted">
        One more question to define the core audience.
      </p>
    </div>
  );

  const options = isOutcome ? getOutcomeOptions(idea) : audienceOptions;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customText.trim()) {
      onSelectAnswer(customText.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-step-fade">
      {/* Back button and stage marker */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs text-charcoal-soft hover:text-charcoal transition-colors font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-warm-border bg-warm-canvas text-accent font-semibold">
          {isOutcome ? 'ONE QUESTION' : 'ONE DECISION'}
        </span>
      </div>

      {introText}

      {/* Idea reminder snippet */}
      <div className="mb-6 p-3 rounded-md border border-warm-border bg-warm-canvas text-xs text-charcoal-muted leading-relaxed">
        <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal-soft mr-2">Idea:</span>
        "{idea}"
      </div>

      <div className="mb-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-charcoal uppercase">
          {questionTitle}
        </h3>
      </div>

      {/* Options grid */}
      <div className="space-y-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectAnswer(opt.label)}
            className="w-full text-left p-4 rounded-lg border border-warm-border bg-warm-canvas hover:border-charcoal hover:bg-white transition-all flex items-center justify-between group"
          >
            <span className="text-sm font-medium text-charcoal">
              {opt.label}
            </span>
            <ArrowRight className="w-4 h-4 text-charcoal-soft group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Custom option toggle */}
      <div className="mt-4 pt-2">
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="text-xs text-charcoal-soft hover:text-charcoal underline underline-offset-4"
          >
            Or write a custom answer...
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type your specific answer..."
              className="flex-1 px-3 py-2 text-sm border border-warm-border rounded-md bg-warm-canvas focus:border-charcoal focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-md bg-charcoal text-white hover:bg-charcoal/90 disabled:opacity-40"
            >
              Confirm
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
