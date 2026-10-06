import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, Scissors, Sparkles, ArrowRight, CornerDownLeft, ChevronDown, ChevronUp } from 'lucide-react';

export default function ImproveWorkspace({ data, onSwitchWorkspace, onRefineIdea, isRefining }) {
  const [refineFeedback, setRefineFeedback] = useState("");
  const [showMoreRisks, setShowMoreRisks] = useState(false);
  const [showFullMVP, setShowFullMVP] = useState(false);

  const improve = data?.improve || {};
  const refinedPitch = improve.refined_pitch || data?.summary || "Refined project formulation";
  const valueProp = improve.value_proposition || "Core value delivered to end user";
  const risks = improve.identified_risks || [];
  const mustHaves = improve.must_have_features || [];
  const cutFeatures = improve.cut_features || [];
  const differentiator = improve.key_differentiator || "Unique technical or product insight";

  const visibleRisks = showMoreRisks ? risks : risks.slice(0, 2);
  const primaryMustHaves = mustHaves.slice(0, 3);
  const secondaryMustHaves = mustHaves.slice(3);

  const handleRefineSubmit = (e) => {
    e.preventDefault();
    if (refineFeedback.trim() && !isRefining) {
      onRefineIdea(refineFeedback.trim());
      setRefineFeedback("");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Finding & Key Recommendation */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-charcoal uppercase tracking-wider">
            <Target className="h-3.5 w-3.5 text-accent" />
            <span>Refined Pitch</span>
          </div>
          <p className="mt-2.5 text-base sm:text-lg font-serif font-semibold text-charcoal leading-snug">
            "{refinedPitch}"
          </p>
        </div>

        <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-charcoal uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Key Recommendation & Wedge</span>
          </div>
          <p className="mt-2.5 text-sm text-charcoal leading-relaxed font-medium">
            {differentiator}
          </p>
          <p className="mt-1 text-xs text-charcoal-muted">
            {valueProp}
          </p>
        </div>
      </div>

      {/* 2. Most Important Risks (With "Show more risks" toggle) */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
            <span>Most Important Risks</span>
          </div>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Top Execution Hazards
          </span>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {visibleRisks.map((risk, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg border border-warm-border/80 bg-warm-panel/50 p-3 text-xs leading-relaxed text-charcoal"
            >
              <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-warm-subtle text-[10px] font-mono font-bold text-charcoal-soft">
                {idx + 1}
              </span>
              <span>{risk}</span>
            </div>
          ))}
        </div>

        {risks.length > 2 && (
          <div className="mt-3 pt-2">
            <button
              type="button"
              onClick={() => setShowMoreRisks(!showMoreRisks)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal-soft hover:text-charcoal transition-colors"
            >
              <span>{showMoreRisks ? 'Show fewer risks' : `Show more risks (${risks.length - 2} more)`}</span>
              {showMoreRisks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* 3. MVP Core Scope (With "Show full MVP" toggle) */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
            <span>MVP Core Features</span>
          </div>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Build First
          </span>
        </div>

        <ol className="mt-3.5 space-y-2 text-sm text-charcoal">
          {primaryMustHaves.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2 rounded hover:bg-warm-panel/50 transition-colors">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-charcoal text-white text-xs font-mono font-semibold">
                {idx + 1}
              </span>
              <span className="pt-0.5 leading-snug">{feature}</span>
            </li>
          ))}
        </ol>

        {/* Secondary information: Expandable Full MVP and features to cut */}
        <div className="mt-4 pt-3 border-t border-warm-border/60">
          <button
            type="button"
            onClick={() => setShowFullMVP(!showFullMVP)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal-soft hover:text-charcoal transition-colors"
          >
            <span>{showFullMVP ? 'Hide full MVP details' : 'Show full MVP & features to cut'}</span>
            {showFullMVP ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFullMVP && (
            <div className="mt-3 space-y-3 pt-2 border-t border-warm-border/40 animate-step-fade">
              {secondaryMustHaves.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
                    Additional MVP Tasks:
                  </span>
                  <ul className="space-y-1 text-xs text-charcoal">
                    {secondaryMustHaves.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cutFeatures.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1.5 flex items-center gap-1">
                    <Scissors className="w-3 h-3" /> Cut to Prevent Scope Creep:
                  </span>
                  <div className="space-y-1.5">
                    {cutFeatures.map((cut, idx) => (
                      <div key={idx} className="p-2 rounded bg-warm-subtle/30 border border-warm-border/50 text-xs text-charcoal-muted">
                        <span className="line-through text-charcoal-soft mr-1.5">{cut}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Refine input optional loop */}
      <div className="rounded-xl border border-warm-border bg-warm-panel/40 p-4">
        <form onSubmit={handleRefineSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={refineFeedback}
            onChange={(e) => setRefineFeedback(e.target.value)}
            disabled={isRefining}
            placeholder="Want to sharpen this idea further? (e.g., Focus only on college seniors...)"
            className="flex-1 rounded-lg border border-warm-border bg-warm-canvas px-3.5 py-2 text-xs text-charcoal placeholder:text-charcoal-soft focus:border-charcoal focus:outline-none"
          />
          <button
            type="submit"
            disabled={!refineFeedback.trim() || isRefining}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-warm-border bg-warm-canvas px-3 py-2 text-xs font-mono font-semibold text-charcoal hover:border-charcoal transition-colors disabled:opacity-40"
          >
            <span>{isRefining ? 'Refining...' : 'Refine'}</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* 4. Obvious Primary Action at the bottom */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onSwitchWorkspace('build')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-all font-medium text-sm shadow-xs group font-mono"
        >
          <span>Plan the build</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
