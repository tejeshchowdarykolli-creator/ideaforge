import React from 'react';
import IdeaCanvas from './IdeaCanvas';
import GoalSelector from './GoalSelector';
import ProgressIndicator from './ProgressIndicator';

export default function IdeaHome({
  idea,
  setIdea,
  onSelectGoal,
  selectedGoal,
  error,
  onClearError,
}) {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 animate-step-fade">
      {/* Top Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-bold tracking-widest text-charcoal-soft uppercase">
            PRODUCT STUDIO
          </span>
          <span className="text-warm-border">•</span>
          <span className="text-xs font-mono text-accent font-semibold tracking-wider uppercase">
            AI GUIDE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-charcoal tracking-tight">
          IdeaForge
        </h1>
        <p className="mt-2 text-sm sm:text-base text-charcoal-muted max-w-md mx-auto">
          Turn a rough thought into something you can build.
        </p>

        <div className="mt-6">
          <ProgressIndicator currentStep="input" />
        </div>
      </div>

      {/* Center of page: Large Bordered Idea Canvas */}
      <div>
        <IdeaCanvas
          idea={idea}
          setIdea={setIdea}
          error={error}
          onClearError={onClearError}
        />
      </div>

      {/* Visual Bridge: AI Understands */}
      <div className="flex flex-col items-center my-5">
        <div className="w-px h-5 bg-warm-border" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-warm-border bg-warm-panel text-xs font-mono text-charcoal shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-charcoal-muted">AI understands:</span>
          <span className="font-semibold text-charcoal">
            {idea.toLowerCase().includes('intern')
              ? 'Student Career & Internship Discovery'
              : idea.toLowerCase().includes('note')
              ? 'Peer Academic Knowledge Sharing'
              : idea.toLowerCase().includes('crop')
              ? 'AgriTech Pathology & Field Diagnostics'
              : idea.toLowerCase().includes('code')
              ? 'Developer Automation & Review Pipeline'
              : 'Product Wedge & MVP Scope'}
          </span>
        </div>
        <div className="w-px h-5 bg-warm-border" />
      </div>

      {/* Below the idea: What do you want to figure out? (3 interactive action cards) */}
      <div>
        <GoalSelector
          onSelectGoal={onSelectGoal}
          selectedGoal={selectedGoal}
        />
      </div>

      {/* Subtle footnote */}
      <div className="mt-12 text-center text-[11px] font-mono text-charcoal-soft">
        <span>No chat walls • Interactive product planner • Hackathon & MVP scoped</span>
      </div>
    </div>
  );
}
