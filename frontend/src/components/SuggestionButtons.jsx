import React from 'react';
import { Lightbulb, Search, Rocket, Compass } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: "Student internships",
    icon: Rocket,
    prompt: "I want to build an AI platform that helps college students find internships.",
  },
  {
    label: "Academic notes vault",
    icon: Lightbulb,
    prompt: "I want to build an app that helps students exchange high-quality academic notes.",
  },
  {
    label: "Offline crop diagnostics",
    icon: Compass,
    prompt: "I want to build an AI system that helps farmers detect crop diseases using smartphone camera photos offline.",
  },
];

export default function SuggestionButtons({ onSelectSuggestion, disabled }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
      <span className="text-[11px] text-charcoal-soft">Try an example:</span>
      {SUGGESTIONS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSuggestion(item.prompt)}
            className="group inline-flex items-center gap-1.5 rounded-md border border-warm-border bg-warm-canvas px-3 py-1.5 text-xs text-charcoal shadow-2xs transition-all hover:border-charcoal hover:bg-warm-panel active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon className="h-3.5 w-3.5 text-charcoal-soft transition-colors group-hover:text-charcoal" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
