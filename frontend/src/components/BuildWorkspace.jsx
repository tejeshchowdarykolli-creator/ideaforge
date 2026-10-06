import React, { useState } from 'react';
import MermaidDiagram from './MermaidDiagram';
import { Layers, CheckCircle2, Copy, Check, Download, ChevronDown, ChevronUp, FolderTree, ArrowLeft } from 'lucide-react';

export default function BuildWorkspace({ data, onSwitchWorkspace }) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [showProjectStructure, setShowProjectStructure] = useState(false);
  const [copiedStructure, setCopiedStructure] = useState(false);

  const build = data?.build || {};
  const techStack = build.tech_stack || {};
  const diagramCode = build.mermaid_diagram || "flowchart TD\n  Client[Frontend] --> API[Backend API]\n  API --> AI[AI Engine]";
  const sprintTimeline = build.sprint_timeline || [];
  const checklist = build.implementation_checklist || [];

  const frontendItems = Array.isArray(techStack.frontend) ? techStack.frontend.join(', ') : (techStack.frontend || 'React, Vite, Tailwind');
  const backendItems = Array.isArray(techStack.backend) ? techStack.backend.join(', ') : (techStack.backend || 'Python, Flask');
  const aiItems = Array.isArray(techStack.ai_services) ? techStack.ai_services.join(', ') : (techStack.ai_services || 'Gemini API');
  const storageItems = Array.isArray(techStack.storage) ? techStack.storage.join(', ') : (techStack.storage || 'PostgreSQL, Local Cache');

  // Generate realistic project folder structure based on tech stack
  const projectStructureTree = `my-${(data?.summary || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24)}/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── WorkflowView.jsx
│   │   │   └── ResultCard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
└── README.md`;

  const handleCopyStructure = () => {
    navigator.clipboard.writeText(projectStructureTree);
    setCopiedStructure(true);
    setTimeout(() => setCopiedStructure(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tech Stack Overview */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3 mb-3.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-accent" />
            <span>Recommended Tech Stack</span>
          </div>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Fast MVP Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg border border-warm-border bg-warm-panel/50">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              Frontend
            </span>
            <p className="text-sm font-semibold text-charcoal">{frontendItems}</p>
          </div>

          <div className="p-3.5 rounded-lg border border-warm-border bg-warm-panel/50">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              Backend
            </span>
            <p className="text-sm font-semibold text-charcoal">{backendItems}</p>
          </div>

          <div className="p-3.5 rounded-lg border border-warm-border bg-warm-panel/50">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              AI Engine
            </span>
            <p className="text-sm font-semibold text-charcoal">{aiItems}</p>
          </div>

          <div className="p-3.5 rounded-lg border border-warm-border bg-warm-panel/50">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-1">
              Database
            </span>
            <p className="text-sm font-semibold text-charcoal">{storageItems}</p>
          </div>
        </div>

        {techStack.rationale && (
          <p className="mt-3.5 text-xs text-charcoal-muted leading-relaxed">
            <span className="font-semibold text-charcoal">Rationale:</span> {techStack.rationale}
          </p>
        )}
      </div>

      {/* 2. System Architecture Diagram */}
      <div>
        <MermaidDiagram diagramCode={diagramCode} />
      </div>

      {/* 3. Implementation Checklist & Expandable Sprint Timeline */}
      <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3 mb-3.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
            <span>Implementation Checklist</span>
          </div>
          <span className="text-[11px] font-mono text-charcoal-soft">
            Core Build Tasks
          </span>
        </div>

        <ul className="space-y-2 text-sm text-charcoal">
          {checklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-1.5 rounded hover:bg-warm-panel/50 transition-colors">
              <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-warm-panel border border-warm-border text-[10px] font-mono font-semibold text-charcoal">
                {idx + 1}
              </span>
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>

        {/* Expandable Hackathon Sprint Timeline */}
        {sprintTimeline.length > 0 && (
          <div className="mt-4 pt-3 border-t border-warm-border/60">
            <button
              type="button"
              onClick={() => setShowTimeline(!showTimeline)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal-soft hover:text-charcoal transition-colors"
            >
              <span>{showTimeline ? 'Hide sprint phases' : 'Show full sprint timeline (24-48 hr schedule)'}</span>
              {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTimeline && (
              <div className="mt-3.5 space-y-3 pt-2 border-t border-warm-border/40 animate-step-fade">
                {sprintTimeline.map((phase, idx) => (
                  <div key={idx} className="rounded-lg border border-warm-border/80 bg-warm-panel/40 p-3 text-xs">
                    <div className="flex items-center justify-between font-semibold text-charcoal">
                      <span>{phase.phase}</span>
                      <span className="text-[10px] font-mono text-charcoal-soft">{phase.goal}</span>
                    </div>
                    {phase.tasks && (
                      <ul className="mt-2 space-y-1 text-charcoal-muted">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-charcoal-soft" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Generated Project Structure Box (Revealed on Primary Action) */}
      {showProjectStructure && (
        <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-xs animate-step-fade">
          <div className="flex items-center justify-between border-b border-warm-border/60 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
              <FolderTree className="w-3.5 h-3.5 text-accent" />
              <span>Project Structure Scaffold</span>
            </div>
            <button
              type="button"
              onClick={handleCopyStructure}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-warm-border bg-warm-panel hover:border-charcoal text-charcoal font-mono transition-colors"
            >
              {copiedStructure ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Directory Tree</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-warm-panel/70 border border-warm-border font-mono text-xs text-charcoal overflow-x-auto leading-relaxed">
            {projectStructureTree}
          </pre>
        </div>
      )}

      {/* 5. Obvious Primary Action at the bottom */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSwitchWorkspace('improve')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal-soft hover:text-charcoal transition-colors order-2 sm:order-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Improve</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowProjectStructure(true);
            handleCopyStructure();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-all font-medium text-sm shadow-xs group font-mono order-1 sm:order-2"
        >
          <FolderTree className="w-4 h-4" />
          <span>Generate project structure →</span>
        </button>
      </div>
    </div>
  );
}
