import React, { useState } from 'react';
import ResearchWorkspace from './ResearchWorkspace';
import ImproveWorkspace from './ImproveWorkspace';
import BuildWorkspace from './BuildWorkspace';
import { ArrowLeft, Compass, Wrench, Hammer, ChevronDown, ChevronUp, HelpCircle, Paperclip } from 'lucide-react';

export default function WorkspaceRouter({
  data,
  originalIdea,
  attachedFiles = [],
  activeWorkspace,
  onSwitchWorkspace,
  onReset,
  onRefineIdea,
  isRefining,
}) {
  const [showRationale, setShowRationale] = useState(false);

  const summary = data?.summary || "Project Idea";
  const reason = data?.reason || "";
  const ideaText = originalIdea || summary;

  const tabs = [
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'improve', label: 'Improve', icon: Wrench },
    { id: 'build', label: 'Build', icon: Hammer },
  ];

  return (
    <div className="min-h-screen bg-warm-bg text-charcoal pb-24">
      {/* Top Navigation Bar: Simple navigation Research | Improve | Build */}
      <header className="sticky top-0 z-20 border-b border-warm-border bg-warm-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left: Branding & New Idea Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-md border border-warm-border bg-warm-canvas px-2.5 py-1.5 text-xs font-mono font-medium text-charcoal hover:border-charcoal/40 transition-colors shadow-2xs"
              title="Start a new idea"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>New Idea</span>
            </button>

            <div className="h-4 w-px bg-warm-border" />

            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base tracking-tight text-charcoal">
                IdeaForge
              </span>
            </div>
          </div>

          {/* Right: Simple Workspace Navigation (Research | Improve | Build) */}
          <nav className="flex items-center rounded-lg border border-warm-border bg-warm-panel p-1 font-mono text-xs shadow-2xs">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeWorkspace === tab.id;

              return (
                <React.Fragment key={tab.id}>
                  <button
                    type="button"
                    onClick={() => onSwitchWorkspace(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-charcoal text-white shadow-xs font-semibold'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-warm-canvas/60'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                  {idx < tabs.length - 1 && (
                    <span className="text-warm-border px-0.5 select-none hidden sm:inline">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 space-y-6">
        {/* Simplified Result Header: Idea & Main Finding */}
        <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 sm:p-6 shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal-soft font-semibold">
                Your Idea
              </span>
              <span className="text-[11px] font-mono text-accent font-medium">
                Workspace: {activeWorkspace.toUpperCase()}
              </span>
            </div>

            <p className="text-lg sm:text-xl font-serif text-charcoal font-semibold leading-snug">
              "{ideaText}"
            </p>

            {attachedFiles && attachedFiles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-mono text-charcoal-soft">
                  Attached files:
                </span>
                {attachedFiles.map((file, idx) => (
                  <span
                    key={file.id || idx}
                    className="inline-flex items-center gap-1 rounded bg-warm-panel px-2 py-0.5 text-[11px] font-mono text-charcoal border border-warm-border/80"
                    title={file.name}
                  >
                    <Paperclip className="h-3 w-3 text-accent shrink-0" />
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <span className="text-[10px] text-charcoal-soft">({file.sizeFormatted})</span>
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-warm-border/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-soft block mb-0.5">
                Main Finding
              </span>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                {summary}
              </p>
            </div>
          </div>

          {/* Secondary Information: Expandable "Why did the AI recommend this?" */}
          {reason && (
            <div className="mt-4 pt-3 border-t border-warm-border/50">
              <button
                type="button"
                onClick={() => setShowRationale(!showRationale)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal-soft hover:text-charcoal transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why did the AI recommend this?</span>
                {showRationale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showRationale && (
                <div className="mt-2.5 rounded-lg border border-warm-border bg-warm-panel p-3.5 text-xs leading-relaxed text-charcoal-muted animate-step-fade">
                  {reason}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Workspace Views */}
        <div>
          {activeWorkspace === 'research' && (
            <ResearchWorkspace
              data={data}
              onSwitchWorkspace={onSwitchWorkspace}
            />
          )}

          {activeWorkspace === 'improve' && (
            <ImproveWorkspace
              data={data}
              onSwitchWorkspace={onSwitchWorkspace}
              onRefineIdea={onRefineIdea}
              isRefining={isRefining}
            />
          )}

          {activeWorkspace === 'build' && (
            <BuildWorkspace
              data={data}
              onSwitchWorkspace={onSwitchWorkspace}
            />
          )}
        </div>
      </main>
    </div>
  );
}
