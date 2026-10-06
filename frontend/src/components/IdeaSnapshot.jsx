import React, { useState } from 'react';
import { ArrowRight, RotateCcw, AlertCircle, Sparkles, Compass, Hammer, CheckCircle2 } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';

export default function IdeaSnapshot({
  idea,
  data,
  initialLens = 'improve',
  onPlanMVP,
  onImproveAgain,
}) {
  const [activeLens, setActiveLens] = useState(initialLens || 'improve'); // 'improve' | 'research' | 'build'

  if (!data) return null;

  const improve = data.improve || {};
  const research = data.research || {};
  const build = data.build || {};

  const ideaTitle = improve.refined_pitch || data.summary || idea;
  const whyItMatters = research.market_need || improve.value_proposition || "Solves an acute friction point for target users.";
  const coreDifferentiator = improve.key_differentiator || "Direct, verified automation of an existing manual workflow.";
  const buildFirstList = (improve.must_have_features && improve.must_have_features.length > 0)
    ? improve.must_have_features.slice(0, 4)
    : [
        "Core user workflow and submission",
        "Automated intelligence and verification",
        "Search, filtering, and result view",
        "Feedback and verification loop",
      ];
  const biggestRisk = (improve.identified_risks && improve.identified_risks.length > 0)
    ? improve.identified_risks[0]
    : "Achieving high organic engagement during the initial launch.";

  return (
    <div className="w-full max-w-2xl mx-auto animate-step-fade py-6">
      {/* Top breadcrumb */}
      <div className="mb-6">
        <ProgressIndicator currentStep="snapshot" />
      </div>

      {/* Snapshot Card */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-6 sm:p-8 space-y-6">
        {/* Header label & Lens Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-warm-border/60 pb-3">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-charcoal uppercase block">
              YOUR IDEA PLAN • SNAPSHOT
            </span>
            <span className="text-xs text-charcoal-muted">
              Choose a lens to inspect or click Plan my MVP below.
            </span>
          </div>

          {/* Interactive Lens Chips: Improve / Research / Build */}
          <div className="flex items-center gap-1.5 p-1 rounded-md bg-warm-panel border border-warm-border self-start sm:self-auto font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveLens('improve')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                activeLens === 'improve'
                  ? 'bg-charcoal text-white font-medium shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Improve</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLens('research')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                activeLens === 'research'
                  ? 'bg-charcoal text-white font-medium shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Research</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLens('build')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                activeLens === 'build'
                  ? 'bg-charcoal text-white font-medium shadow-2xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Hammer className="w-3 h-3" />
              <span>Build</span>
            </button>
          </div>
        </div>

        {/* Section: YOUR IDEA (Always prominent) */}
        <div>
          <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
            YOUR IDEA
          </h4>
          <p className="text-xl sm:text-2xl font-serif text-charcoal font-semibold leading-snug">
            {ideaTitle}
          </p>
        </div>

        {/* LENS 1: IMPROVE (Default) */}
        {activeLens === 'improve' && (
          <div className="space-y-5 animate-step-fade">
            {/* WHY IT MATTERS */}
            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
                WHY IT MATTERS
              </h4>
              <p className="text-sm text-charcoal leading-relaxed">
                {whyItMatters}
              </p>
            </div>

            {/* CORE DIFFERENTIATOR */}
            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
                CORE DIFFERENTIATOR
              </h4>
              <p className="text-sm text-charcoal leading-relaxed font-medium">
                {coreDifferentiator}
              </p>
            </div>

            {/* BUILD FIRST */}
            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-2">
                BUILD FIRST
              </h4>
              <ol className="space-y-2 text-sm text-charcoal">
                {buildFirstList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-warm-panel border border-warm-border text-xs font-mono font-semibold text-charcoal">
                      {idx + 1}
                    </span>
                    <span className="leading-tight pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* BIGGEST RISK */}
            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-accent" /> BIGGEST RISK
              </h4>
              <p className="text-sm text-charcoal leading-relaxed bg-warm-subtle/40 p-3 rounded-md border border-warm-border/60">
                {biggestRisk}
              </p>
            </div>
          </div>
        )}

        {/* LENS 2: RESEARCH */}
        {activeLens === 'research' && (
          <div className="space-y-5 animate-step-fade">
            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
                TARGET AUDIENCE
              </h4>
              <p className="text-sm text-charcoal leading-relaxed font-medium">
                {research.target_audience || "College students seeking structured productivity."}
              </p>
            </div>

            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
                MARKET PAIN POINT
              </h4>
              <p className="text-sm text-charcoal leading-relaxed">
                {research.market_need || whyItMatters}
              </p>
            </div>

            {research.existing_alternatives && (
              <div className="pt-2 border-t border-warm-border/50">
                <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1.5">
                  EXISTING ALTERNATIVES
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {research.existing_alternatives.map((alt, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded bg-warm-panel border border-warm-border text-charcoal">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {research.validation_checklist && (
              <div className="pt-2 border-t border-warm-border/50">
                <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1.5">
                  VALIDATION CHECKLIST
                </h4>
                <ul className="space-y-1.5 text-xs text-charcoal">
                  {research.validation_checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* LENS 3: BUILD SUMMARY */}
        {activeLens === 'build' && (
          <div className="space-y-5 animate-step-fade">
            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
                CORE MVP CAPABILITY
              </h4>
              <p className="text-sm text-charcoal leading-relaxed font-medium">
                {buildFirstList[0] || "Fast, verified user upload and match workflow"}
              </p>
            </div>

            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-1">
                TECH STACK HIGHLIGHT
              </h4>
              <p className="text-sm text-charcoal leading-relaxed">
                {Array.isArray(build.tech_stack?.frontend) ? build.tech_stack.frontend.join(', ') : 'React, Vite'} + {Array.isArray(build.tech_stack?.backend) ? build.tech_stack.backend.join(', ') : 'Flask'} + Gemini AI
              </p>
            </div>

            <div className="pt-2 border-t border-warm-border/50">
              <h4 className="text-[11px] font-mono font-semibold text-charcoal-soft uppercase tracking-wider mb-2">
                BUILD FIRST (1–4)
              </h4>
              <ol className="space-y-2 text-sm text-charcoal">
                {buildFirstList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-warm-panel border border-warm-border text-xs font-mono font-semibold text-charcoal">
                      {idx + 1}
                    </span>
                    <span className="leading-tight pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Action Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onImproveAgain}
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-soft hover:text-charcoal transition-colors order-2 sm:order-1 font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Improve again</span>
        </button>

        {/* ONE STRONG PRIMARY ACTION */}
        <button
          type="button"
          onClick={onPlanMVP}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-all font-medium text-sm shadow-xs order-1 sm:order-2 group"
        >
          <span>Plan my MVP</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
