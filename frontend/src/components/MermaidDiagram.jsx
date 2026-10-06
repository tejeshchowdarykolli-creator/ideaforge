import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Code, Eye, Copy, Check, Network } from 'lucide-react';

export default function MermaidDiagram({ diagramCode }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [renderError, setRenderError] = useState(null);
  const [viewMode, setViewMode] = useState("diagram"); // "diagram" or "code"
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'Plus Jakarta Sans, Inter, -apple-system, sans-serif',
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
      const uniqueId = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;

      try {
        let cleanCode = diagramCode.trim();
        if (cleanCode.startsWith('```')) {
          cleanCode = cleanCode.replace(/^```(?:mermaid)?\n?/, '').replace(/\n?```$/, '');
        }

        const { svg } = await mermaid.render(uniqueId, cleanCode);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setRenderError(err.message || "Failed to render diagram syntax");
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
    <div className="rounded-xl border border-warm-border bg-warm-canvas p-5 shadow-2xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-warm-border/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-warm-panel text-charcoal border border-warm-border">
            <Network className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-charcoal uppercase tracking-wider">
              System Architecture Diagram
            </h3>
            <p className="text-[11px] text-charcoal-muted">
              Interactive topology rendered client-side via Mermaid.js
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "diagram" ? "code" : "diagram")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            {viewMode === "diagram" ? (
              <>
                <Code className="h-3.5 w-3.5" />
                <span>View Syntax</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>View Diagram</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition hover:bg-neutral-50"
            title="Copy Mermaid Code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-neutral-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagram or Code Display */}
      <div className="mt-4">
        {viewMode === "code" ? (
          <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs text-neutral-800 leading-relaxed">
            {diagramCode}
          </pre>
        ) : renderError ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <p className="font-semibold">Diagram Syntax Note:</p>
            <p className="mt-1 font-mono text-[11px] text-amber-800">{renderError}</p>
            <pre className="mt-3 overflow-x-auto rounded bg-white p-3 font-mono text-[11px] text-neutral-700 border border-amber-200">
              {diagramCode}
            </pre>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            className="flex items-center justify-center overflow-x-auto py-4 [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="py-12 text-center text-xs text-neutral-400">
            Generating architecture diagram...
          </div>
        )}
      </div>
    </div>
  );
}
