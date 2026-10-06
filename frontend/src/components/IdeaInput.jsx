import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowRight,
  X,
  Paperclip,
  Upload,
  FileText,
  FileCode,
  FileSpreadsheet,
  File,
  Plus,
} from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'json', 'sql', 'sh', 'yaml', 'yml'].includes(ext)) {
    return FileCode;
  }
  if (['csv', 'xlsx', 'xls'].includes(ext)) {
    return FileSpreadsheet;
  }
  if (['md', 'txt', 'doc', 'docx', 'pdf', 'markdown', 'rtf'].includes(ext)) {
    return FileText;
  }
  return File;
}

const readFileData = (file) => {
  return new Promise((resolve) => {
    const isTextLike =
      file.type.startsWith('text/') ||
      file.type.includes('json') ||
      file.type.includes('javascript') ||
      file.type.includes('xml') ||
      /\.(txt|md|markdown|json|csv|py|js|jsx|ts|tsx|html|css|yaml|yml|xml|sql|sh|env|log)$/i.test(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result || '';
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || 'text/plain',
        content: typeof result === 'string' ? result : '',
        status: 'ready',
      });
    };

    reader.onerror = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || 'application/octet-stream',
        content: `[Attached file: ${file.name} (${formatFileSize(file.size)})]`,
        status: 'ready',
      });
    };

    if (isTextLike || file.size < 512 * 1024) {
      try {
        reader.readAsText(file);
      } catch (err) {
        resolve({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          name: file.name,
          size: file.size,
          sizeFormatted: formatFileSize(file.size),
          type: file.type || 'application/octet-stream',
          content: `[Attached document: ${file.name}]`,
          status: 'ready',
        });
      }
    } else {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || 'application/octet-stream',
        content: `[Attached document: ${file.name} (${formatFileSize(file.size)})]`,
        status: 'ready',
      });
    }
  });
};

export default function IdeaInput({
  value,
  onChange,
  files = [],
  onFilesChange,
  onAnalyze,
  isLoading,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-grow textarea height gracefully
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, 100),
        260
      )}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const hasContent = value.trim() || files.length > 0;
      if (hasContent && !isLoading) {
        onAnalyze();
      }
    }
  };

  const handleClearText = () => {
    onChange("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFilesAdded = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incomingFiles = Array.from(fileList);
    
    // Read files
    const parsedFiles = await Promise.all(incomingFiles.map((f) => readFileData(f)));
    
    // Avoid duplicate file names if possible
    const existingNames = new Set(files.map((f) => f.name));
    const newUniqueFiles = parsedFiles.filter((f) => !existingNames.has(f.name));

    if (onFilesChange) {
      onFilesChange([...files, ...newUniqueFiles]);
    }

    // Reset input value so re-selecting same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId) => {
    if (onFilesChange) {
      onFilesChange(files.filter((f) => f.id !== fileId));
    }
  };

  const handleClearAllFiles = () => {
    if (onFilesChange) {
      onFilesChange([]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isLoading && e.dataTransfer.files) {
      await handleFilesAdded(e.dataTransfer.files);
    }
  };

  const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const canAnalyze = (value.trim().length > 0 || files.length > 0) && !isLoading;

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFilesAdded(e.target.files)}
        className="hidden"
        accept=".txt,.md,.markdown,.json,.csv,.py,.js,.jsx,.ts,.tsx,.html,.css,.yaml,.yml,.xml,.sql,.pdf,.doc,.docx,text/*"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative rounded-xl border p-4 sm:p-5 shadow-xs transition-all duration-200 ${
          isDragging
            ? 'border-charcoal bg-warm-panel/80 ring-2 ring-charcoal/20'
            : 'border-warm-border bg-warm-canvas hover:border-warm-borderStrong focus-within:border-charcoal focus-within:ring-1 focus-within:ring-charcoal'
        }`}
      >
        {/* Active Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-warm-canvas/95 backdrop-blur-2xs border-2 border-dashed border-charcoal text-center p-4">
            <Upload className="h-7 w-7 text-charcoal animate-bounce mb-2" />
            <span className="font-mono text-sm font-semibold text-charcoal">
              Drop files here to attach
            </span>
            <span className="text-xs text-charcoal-muted mt-1">
              Supports PRDs, markdown, notes, specs, code, or data
            </span>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={3}
          placeholder="Describe your idea or attach project files... (e.g., I want to build an AI platform that helps college students find internships.)"
          className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-charcoal placeholder:text-charcoal-soft/60 focus:outline-none"
        />

        {/* Clear Text Button if input not empty */}
        {value.trim().length > 0 && !isLoading && (
          <button
            type="button"
            onClick={handleClearText}
            className="absolute top-3.5 right-3.5 text-charcoal-soft hover:text-charcoal transition p-1 rounded-md hover:bg-warm-panel"
            title="Clear text"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* SECTION TO INPUT FILES */}
        <div className="mt-3">
          {files.length === 0 ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
              className="group/attach flex items-center justify-between rounded-lg border border-dashed border-warm-borderStrong/70 bg-warm-panel/40 px-3.5 py-2.5 text-xs text-charcoal-muted hover:border-charcoal hover:bg-warm-panel cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-charcoal-soft group-hover/attach:text-charcoal transition-colors" />
                <span className="font-medium text-charcoal">Attach project files</span>
                <span className="text-charcoal-soft hidden sm:inline">• PRD, specs, notes, code, or docs</span>
              </div>
              <span className="rounded border border-warm-border bg-warm-canvas px-2.5 py-1 text-[11px] font-mono text-charcoal-soft hover:text-charcoal shadow-2xs font-medium">
                Browse files
              </span>
            </div>
          ) : (
            <div className="space-y-2.5 rounded-lg border border-warm-border bg-warm-panel/50 p-3 animate-step-fade">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-charcoal">
                  <Paperclip className="h-3.5 w-3.5 text-accent" />
                  <span className="font-semibold">Attached Files ({files.length})</span>
                  <span className="text-charcoal-soft text-[11px] font-normal">
                    • {formatFileSize(totalBytes)} total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-charcoal hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add more</span>
                  </button>
                  <span className="text-warm-border">|</span>
                  <button
                    type="button"
                    onClick={handleClearAllFiles}
                    className="text-[11px] font-mono text-rose-600 hover:text-rose-800 transition"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {/* File Chips */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                {files.map((file) => {
                  const Icon = getFileIcon(file.name);
                  return (
                    <div
                      key={file.id}
                      className="group inline-flex items-center gap-2 rounded-md border border-warm-border bg-warm-canvas px-2.5 py-1.5 text-xs shadow-2xs hover:border-charcoal/40 transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 text-charcoal-soft shrink-0" />
                      <span
                        className="font-mono text-charcoal max-w-[130px] sm:max-w-[200px] truncate font-medium text-[11px]"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal-soft bg-warm-panel px-1.5 py-0.5 rounded border border-warm-border/60">
                        {file.sizeFormatted}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-charcoal-soft hover:text-rose-600 hover:bg-rose-50 transition p-0.5 rounded"
                        title={`Remove ${file.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions inside input box */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-warm-border/60 pt-3 text-xs text-charcoal-soft">
          <div className="flex items-center gap-2.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded border border-warm-border bg-warm-panel px-2 py-1 text-[11px] font-mono text-charcoal hover:border-charcoal hover:bg-warm-canvas transition-colors shadow-2xs"
              title="Attach project files (PRD, notes, specifications, code)"
            >
              <Paperclip className="h-3 w-3" />
              <span>Attach</span>
              {files.length > 0 && (
                <span className="ml-0.5 rounded-full bg-charcoal px-1.5 py-0.2 text-[9px] font-bold text-white">
                  {files.length}
                </span>
              )}
            </button>

            <span className="text-warm-border">&bull;</span>

            <span className="hidden sm:flex items-center gap-1">
              <kbd className="rounded border border-warm-border bg-warm-panel px-1.5 py-0.5 text-[10px] text-charcoal">
                ↵ Enter
              </kbd>
              <span>to analyze</span>
            </span>

            <span className="text-warm-border hidden sm:inline">&bull;</span>

            <span className="hidden sm:flex items-center gap-1">
              <kbd className="rounded border border-warm-border bg-warm-panel px-1.5 py-0.5 text-[10px] text-charcoal">
                Shift+↵
              </kbd>
              <span>for new line</span>
            </span>
          </div>

          <button
            id="analyze-idea-btn"
            type="button"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="group/btn inline-flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 text-xs font-mono font-semibold text-white shadow-xs transition-all hover:bg-charcoal/90 hover:shadow-sm active:scale-98 disabled:cursor-not-allowed disabled:bg-warm-border disabled:text-charcoal-soft"
          >
            <span>{files.length > 0 && !value.trim() ? 'Analyze files' : 'Analyze idea'}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
