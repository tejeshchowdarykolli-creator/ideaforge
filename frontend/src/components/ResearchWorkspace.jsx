import React, { useState } from 'react';
import { Users, Search, HelpCircle, CheckSquare, ArrowRight, Compass, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResearchWorkspace({ data, onSwitchWorkspace }) {
  const [showMoreChecks, setShowMoreChecks] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({});

  const research = data?.research || {};
  const targetAudience = research.target_audience || "Target users needing solution";
  const marketNeed = research.market_need || "Specific pain point not solved by current tools";
  const existingAlternatives = research.existing_alternatives || [];
  const criticalUnknowns = research.critical_unknowns || [];
  const validationChecklist = research.validation_checklist || [];

  const topChecklist = validationChecklist.slice(0, 2);
  const remainingChecklist = validationChecklist.slice(2);

  const toggleTask = (index) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Target Audience & Market Need */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-charcoal uppercase tracking-wider">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span>Target Audience Persona</span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-charcoal font-medium">
            {targetAudience}
          </p>
        </div>

        <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-charcoal uppercase tracking-wider">
            <Search className="h-3.5 w-3.5 text-accent" />
            <span>Market Pain Point & Need</span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-charcoal">
            {marketNeed}
          </p>
        </div>
      </div>

      {/* 2. Existing Alternatives */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3 mb-3.5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
            Existing Alternatives & Competitors
          </h3>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Market Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {existingAlternatives.map((alt, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-warm-border/80 bg-warm-panel/40 p-3 text-xs leading-relaxed text-charcoal"
            >
              <span className="font-semibold text-charcoal block mb-0.5">Alternative #{idx + 1}</span>
              <span>{alt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Validation Checklist (With expandable secondary unknowns) */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3 mb-3.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
            <CheckSquare className="h-3.5 w-3.5 text-emerald-700" />
            <span>Key Validation Tests</span>
          </div>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Early Verification
          </span>
        </div>

        <div className="space-y-2.5">
          {topChecklist.map((task, idx) => (
            <label
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-warm-border/60 bg-warm-panel/30 p-3 text-xs text-charcoal cursor-pointer hover:bg-warm-panel/60 transition-colors"
            >
              <input
                type="checkbox"
                checked={!!checkedTasks[idx]}
                onChange={() => toggleTask(idx)}
                className="mt-0.5 rounded border-warm-border text-charcoal focus:ring-0"
              />
              <span className={checkedTasks[idx] ? 'line-through text-charcoal-soft' : ''}>
                {task}
              </span>
            </label>
          ))}
        </div>

        {/* Expandable full validation checklist and critical unknowns */}
        {(remainingChecklist.length > 0 || criticalUnknowns.length > 0) && (
          <div className="mt-4 pt-3 border-t border-warm-border/60">
            <button
              type="button"
              onClick={() => setShowMoreChecks(!showMoreChecks)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal-soft hover:text-charcoal transition-colors"
            >
              <span>{showMoreChecks ? 'Hide extra validation details' : 'Show full validation checklist & unknowns'}</span>
              {showMoreChecks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showMoreChecks && (
              <div className="mt-3 space-y-3.5 pt-2 border-t border-warm-border/40 animate-step-fade">
                {remainingChecklist.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
                      Additional Validation Actions:
                    </span>
                    {remainingChecklist.map((task, idx) => {
                      const actualIdx = idx + topChecklist.length;
                      return (
                        <label
                          key={actualIdx}
                          className="flex items-start gap-3 rounded-lg border border-warm-border/60 bg-warm-panel/20 p-2.5 text-xs text-charcoal cursor-pointer hover:bg-warm-panel/50"
                        >
                          <input
                            type="checkbox"
                            checked={!!checkedTasks[actualIdx]}
                            onChange={() => toggleTask(actualIdx)}
                            className="mt-0.5 rounded border-warm-border text-charcoal focus:ring-0"
                          />
                          <span className={checkedTasks[actualIdx] ? 'line-through text-charcoal-soft' : ''}>
                            {task}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {criticalUnknowns.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Critical Unknown Questions:
                    </span>
                    <ul className="space-y-1.5 text-xs text-charcoal-muted">
                      {criticalUnknowns.map((unknown, i) => (
                        <li key={i} className="flex items-start gap-2 bg-warm-subtle/30 p-2 rounded border border-warm-border/40">
                          <span className="text-charcoal font-bold font-mono">?</span>
                          <span>{unknown}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Obvious Primary Action at the bottom */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onSwitchWorkspace('improve')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-all font-medium text-sm shadow-xs group font-mono"
        >
          <span>Improve this idea</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
