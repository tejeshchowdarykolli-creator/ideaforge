import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { Code, Eye, Copy, Check, Network } from 'lucide-react';

export default function ArchitectureView({ diagramCode }) {
  const [svgContent, setSvgContent] = useState("");
  const [renderError, setRenderError] = useState(null);
  const [viewMode, setViewMode] = useState("diagram");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'Plus Jakarta Sans, -apple-system, sans-serif',
      securityLevel: 'loose',
      themeVariables: {
        fontSize: '12px',
        primaryColor: '#FAF8F5',
        primaryTextColor: '#1C1917',
        primaryBorderColor: '#A8A29E',
        lineColor: '#57534E',
        secondaryColor: '#FFFFFF',
        tertiaryColor: '#F5F2EB',
      },
    });

    if (!diagramCode || !diagramCode.trim()) {
      setSvgContent("");
      return;
    }

    const renderChart = async () => {
      setRenderError(null);
      const uniqueId = `mermaid-arch-${Math.random().toString(36).substring(2, 9)}`;

      try {
        let cleanCode = diagramCode.trim();
        if (cleanCode.startsWith('```')) {
          cleanCode = cleanCode.replace(/^```(?:mermaid)?\n?/, '').replace(/\n?```$/, '');
        }

        const { svg } = await mermaid.render(uniqueId, cleanCode);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid error:", err);
        setRenderError(err.message || "Failed to render diagram");
      }
    };

    renderChart();
  }, [diagramCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(diagramCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-warm-border bg-warm-canvas p-5">
      <div className="flex items-center justify-between border-b border-warm-border/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-charcoal-soft" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal">
            System Architecture
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "diagram" ? "code" : "diagram")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-warm-border hover:bg-warm-panel text-charcoal font-mono transition-colors"
          >
            {viewMode === "diagram" ? (
              <>
                <Code className="w-3 h-3" />
                <span>Code</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Diagram</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-warm-border hover:bg-warm-panel text-charcoal font-mono transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {viewMode === "diagram" ? (
        <div className="overflow-x-auto py-2">
          {renderError ? (
            <div className="p-4 rounded border border-amber-200 bg-amber-50/50 text-xs text-amber-800">
              <p className="font-medium">Diagram syntax fallback:</p>
              <pre className="mt-2 font-mono text-[11px] overflow-x-auto text-charcoal">
                {diagramCode}
              </pre>
            </div>
          ) : svgContent ? (
            <div
              className="flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="py-8 text-center text-xs text-charcoal-soft font-mono">
              Generating system diagram...
            </div>
          )}
        </div>
      ) : (
        <pre className="p-3 rounded bg-warm-panel border border-warm-border text-xs font-mono text-charcoal overflow-x-auto">
          {diagramCode}
        </pre>
      )}
    </div>
  );
}
