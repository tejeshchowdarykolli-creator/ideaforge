import React from 'react';
import IdeaInput from './IdeaInput';
import SuggestionButtons from './SuggestionButtons';
import AnalyzingState from './AnalyzingState';
import { AlertCircle, Sparkles, Terminal } from 'lucide-react';

export default function ChatHome({
  idea,
  setIdea,
  files = [],
  setFiles,
  onAnalyze,
  isLoading,
  error,
  onClearError,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-warm-bg text-charcoal font-sans selection:bg-charcoal selection:text-white">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-10 border-b border-warm-border bg-warm-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-bold text-lg tracking-tight text-charcoal">
              IdeaForge
            </span>
            <span className="text-warm-border hidden sm:inline">•</span>
            <span className="hidden sm:inline text-xs text-charcoal-muted">
              Turn rough ideas into buildable solutions.
            </span>
          </div>

        </div>
      </header>

      {/* Main Centered Hero / Canvas Area */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-2xl space-y-6 animate-step-fade">
          {/* Header Title & Subtitle */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-warm-border bg-warm-panel px-3 py-1 text-xs font-mono font-medium text-charcoal shadow-2xs mb-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>Interactive Idea Workspace</span>
            </div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight text-charcoal sm:text-4xl">
              What are you building?
            </h1>
            <p className="mx-auto max-w-lg text-xs text-charcoal-muted sm:text-sm leading-relaxed">
              Describe your project concept in a few sentences. IdeaForge will stress-test the premise, identify risks, and open the optimal workspace.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start justify-between rounded-lg border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              {onClearError && (
                <button
                  type="button"
                  onClick={onClearError}
                  className="text-rose-500 hover:text-rose-800 transition text-sm font-semibold ml-2"
                >
                  &times;
                </button>
              )}
            </div>
          )}

          {/* Core Interactive Area */}
          {isLoading ? (
            <AnalyzingState />
          ) : (
            <div className="space-y-4">
              <IdeaInput
                value={idea}
                onChange={setIdea}
                files={files}
                onFilesChange={setFiles}
                onAnalyze={onAnalyze}
                isLoading={isLoading}
              />
              <SuggestionButtons
                onSelectSuggestion={(samplePrompt) => {
                  setIdea(samplePrompt);
                  if (onClearError) onClearError();
                }}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </main>

      {/* Clean Studio Footer */}
      <footer className="border-t border-warm-border/60 py-3.5 text-center text-xs text-charcoal-soft font-mono">
        <span>IdeaForge • Product Workspace & Build Planner</span>
      </footer>
    </div>
  );
}
