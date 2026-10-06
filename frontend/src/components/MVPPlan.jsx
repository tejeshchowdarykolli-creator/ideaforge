import React, { useState } from 'react';
import { ArrowRight, Check, Scissors, Layers, CheckCircle2, Copy } from 'lucide-react';
import ArchitectureView from './ArchitectureView';

export default function MVPPlan({ data, idea }) {
  const [copiedAll, setCopiedAll] = useState(false);

  const build = data?.build || {};
  const improve = data?.improve || {};
  const techStack = build?.tech_stack || {};

  const buildFirstFeatures = (improve.must_have_features && improve.must_have_features.length > 0)
    ? improve.must_have_features
    : [
        "Course-based note upload flow",
        "AI quality & relevance verification engine",
        "Search, filter, and tag discovery interface",
        "Peer verification & rating feedback mechanism",
      ];

  const cutFeatures = (improve.cut_features && improve.cut_features.length > 0)
    ? improve.cut_features
    : [
        "Complex crypto or proprietary token economy (use simple karma points instead)",
        "Real-time video chat or live tutoring rooms (focus purely on note exchange)",
        "Multi-institution enterprise admin consoles (test with 1 campus first)",
      ];

  // Tech stack items
  const frontendItems = Array.isArray(techStack.frontend) ? techStack.frontend.join(', ') : (techStack.frontend || 'React, Vite, Tailwind');
  const backendItems = Array.isArray(techStack.backend) ? techStack.backend.join(', ') : (techStack.backend || 'Python, Flask');
  const aiItems = Array.isArray(techStack.ai_services) ? techStack.ai_services.join(', ') : (techStack.ai_services || 'Gemini API');
  const storageItems = Array.isArray(techStack.storage) ? techStack.storage.join(', ') : (techStack.storage || 'PostgreSQL, Local Cache');

  // Next steps (checklist)
  const nextSteps = (build.implementation_checklist && build.implementation_checklist.length > 0)
    ? build.implementation_checklist.slice(0, 4)
    : [
        "Build upload and submission flow",
        "Add AI verification integration",
        "Create searchable catalog and filters",
        "Test with target students and gather feedback",
      ];

  const handleCopySpec = () => {
    const text = `=== BUILD PLAN: ${improve.refined_pitch || idea} ===

BUILD FIRST:
${buildFirstFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

CUT FOR MVP:
${cutFeatures.map((f) => `- ${f}`).join('\n')}

TECH STACK:
- Frontend: ${frontendItems}
- Backend: ${backendItems}
- AI: ${aiItems}
- Storage: ${storageItems}

NEXT STEPS:
${nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 1. BUILD FIRST SECTION */}
      <section className="rounded-lg border border-warm-border bg-warm-canvas p-6">
        <div className="flex items-center justify-between mb-4 border-b border-warm-border/60 pb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
            BUILD FIRST
          </h3>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Core Scope
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Must-have core features */}
          <div>
            <h4 className="text-xs font-semibold text-charcoal mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Must-Have for MVP
            </h4>
            <ul className="space-y-2 text-sm text-charcoal">
              {buildFirstFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-warm-panel border border-warm-border text-xs font-mono font-semibold text-charcoal">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Features to explicitly CUT */}
          <div>
            <h4 className="text-xs font-semibold text-charcoal mb-2.5 flex items-center gap-1.5 text-charcoal-muted">
              <Scissors className="w-3.5 h-3.5 text-charcoal-soft" />
              Cut to Prevent Scope Creep
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              {cutFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-warm-subtle/30 p-2 rounded border border-warm-border/50">
                  <span className="line-through text-charcoal-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. TECH STACK SECTION */}
      <section className="rounded-lg border border-warm-border bg-warm-canvas p-6">
        <div className="flex items-center justify-between mb-4 border-b border-warm-border/60 pb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
            TECH STACK
          </h3>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Architecture Pipeline
          </span>
        </div>

        {/* Horizontal flow pipeline: Frontend -> Backend -> AI -> Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
          <div className="p-3.5 rounded border border-warm-border bg-warm-panel/50 relative">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              Frontend
            </span>
            <p className="text-sm font-semibold text-charcoal">{frontendItems}</p>
          </div>

          <div className="p-3.5 rounded border border-warm-border bg-warm-panel/50 relative">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              Backend
            </span>
            <p className="text-sm font-semibold text-charcoal">{backendItems}</p>
          </div>

          <div className="p-3.5 rounded border border-warm-border bg-warm-panel/50 relative">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              AI Services
            </span>
            <p className="text-sm font-semibold text-charcoal">{aiItems}</p>
          </div>

          <div className="p-3.5 rounded border border-warm-border bg-warm-panel/50 relative">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              Database & Storage
            </span>
            <p className="text-sm font-semibold text-charcoal">{storageItems}</p>
          </div>
        </div>

        {techStack.rationale && (
          <p className="mt-3.5 text-xs text-charcoal-muted leading-relaxed">
            <span className="font-semibold text-charcoal">Rationale:</span> {techStack.rationale}
          </p>
        )}
      </section>

      {/* 3. ARCHITECTURE MERMAID DIAGRAM */}
      <section>
        <ArchitectureView diagramCode={build.mermaid_diagram || "flowchart TD\n  User --> UI[Frontend]\n  UI --> API[Backend]\n  API --> AI[AI Engine]\n  API --> DB[(Database)]"} />
      </section>

      {/* 4. NEXT STEPS SECTION */}
      <section className="rounded-lg border border-warm-border bg-warm-canvas p-6">
        <div className="flex items-center justify-between mb-4 border-b border-warm-border/60 pb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
            NEXT STEPS
          </h3>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Execution Roadmap
          </span>
        </div>

        <ol className="space-y-3 text-sm text-charcoal">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 p-2.5 rounded hover:bg-warm-panel/40 transition-colors">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-charcoal text-white text-xs font-mono font-semibold">
                {idx + 1}
              </span>
              <div className="pt-0.5">
                <p className="font-medium text-charcoal leading-tight">{step}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Copy full spec action */}
        <div className="mt-6 pt-4 border-t border-warm-border/60 flex items-center justify-between">
          <span className="text-xs text-charcoal-soft">
            Ready to start building in code?
          </span>
          <button
            type="button"
            onClick={handleCopySpec}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-warm-border bg-warm-panel hover:border-charcoal text-xs font-medium text-charcoal transition-colors font-mono"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plan Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Build Spec</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
