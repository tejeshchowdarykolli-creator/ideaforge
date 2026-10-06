import React from 'react';

export default function IdeaCanvas({ idea, setIdea, error, onClearError }) {
  const examplePresets = [
    {
      title: "Academic Notes Exchange",
      text: "I want to build an app that helps students exchange high-quality academic notes.",
    },
    {
      title: "Student Internship Matcher",
      text: "I want to build an AI platform that helps college students find internships.",
    },
    {
      title: "Offline Crop Disease Scanner",
      text: "An offline mobile app for smallholder farmers that scans crop leaf lesions and suggests remedies without cellular data.",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="idea-canvas-input"
          className="text-xs font-mono font-semibold tracking-widest text-charcoal-soft uppercase"
        >
          YOUR IDEA
        </label>
        <div className="flex items-center gap-1.5 text-xs text-charcoal-soft">
          <span className="hidden sm:inline">Try an example:</span>
          {examplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIdea(preset.text);
                if (onClearError) onClearError();
              }}
              className="text-[11px] underline underline-offset-2 hover:text-accent transition-colors px-1 py-0.5"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Large bordered idea canvas */}
      <div className="relative rounded-lg border border-warm-border bg-warm-canvas p-4 sm:p-6 transition focus-within:border-charcoal focus-within:ring-1 focus-within:ring-charcoal">
        <textarea
          id="idea-canvas-input"
          value={idea}
          onChange={(e) => {
            setIdea(e.target.value);
            if (error && onClearError) onClearError();
          }}
          rows={4}
          placeholder="I want to build an app that helps students exchange high-quality academic notes..."
          className="w-full resize-none bg-transparent font-sans text-base sm:text-lg text-charcoal placeholder:text-charcoal-soft/60 focus:outline-none leading-relaxed"
        />

        <div className="mt-2 flex items-center justify-between border-t border-warm-border/60 pt-3 text-xs text-charcoal-soft">
          <span>Be as rough or specific as you want.</span>
          <span className="font-mono">{idea.trim().length} chars</span>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
