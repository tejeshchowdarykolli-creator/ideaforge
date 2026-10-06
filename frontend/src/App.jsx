import React, { useState } from 'react';
import ChatHome from './components/ChatHome';
import WorkspaceRouter from './components/WorkspaceRouter';

export default function App() {
  const [idea, setIdea] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState('improve'); // 'research' | 'improve' | 'build'

  // Analyze idea via Flask API
  const handleAnalyze = async (ideaText = idea, feedback = "", attachedFiles = files) => {
    const textToAnalyze = (ideaText || "").trim();
    if (!textToAnalyze && (!attachedFiles || attachedFiles.length === 0)) {
      setError("Please describe what you are building or attach project documents.");
      return;
    }

    if (feedback) {
      setIsRefining(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    // Format idea prompt with attached files
    let combinedPrompt = textToAnalyze;
    if (attachedFiles && attachedFiles.length > 0) {
      const fileSummaries = attachedFiles.map((file, idx) => {
        return `[Attached Document ${idx + 1}: ${file.name} (${file.sizeFormatted})]\n${file.content || '(Document attached)'}`;
      }).join('\n\n');

      if (combinedPrompt) {
        combinedPrompt = `${combinedPrompt}\n\n--- User Attached Project Documents ---\n${fileSummaries}`;
      } else {
        combinedPrompt = `Project documents attached for idea analysis:\n\n${fileSummaries}`;
      }
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: combinedPrompt,
          feedback: feedback,
          files: (attachedFiles || []).map(f => ({ name: f.name, size: f.size, type: f.type })),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || `Server error (${response.status})`);
      }

      const parsedData = json.data;
      if (!parsedData) {
        throw new Error("Invalid response format from server.");
      }

      setAnalysisData(parsedData);

      // Automatically activate AI-selected workspace
      if (!feedback) {
        const nextAction = (parsedData.next_action || parsedData.intent || 'improve').toLowerCase();
        if (['research', 'improve', 'build'].includes(nextAction)) {
          setActiveWorkspace(nextAction);
        } else {
          setActiveWorkspace('improve');
        }
      }
    } catch (err) {
      console.error("API error during analysis:", err);
      setError(err.message || "Failed to analyze idea. Please ensure backend is running.");
    } finally {
      setIsLoading(false);
      setIsRefining(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setIdea("");
    setFiles([]);
    setError(null);
  };

  const handleRefineIdea = (feedbackText) => {
    handleAnalyze(idea, feedbackText, files);
  };

  // If no analysis is active, render the ChatHome screen
  if (!analysisData) {
    return (
      <ChatHome
        idea={idea}
        setIdea={setIdea}
        files={files}
        setFiles={setFiles}
        onAnalyze={() => handleAnalyze(idea, "", files)}
        isLoading={isLoading}
        error={error}
        onClearError={() => setError(null)}
      />
    );
  }

  // Once analyzed, dynamically render the WorkspaceRouter
  return (
    <WorkspaceRouter
      data={analysisData}
      originalIdea={idea}
      attachedFiles={files}
      activeWorkspace={activeWorkspace}
      onSwitchWorkspace={setActiveWorkspace}
      onReset={handleReset}
      onRefineIdea={handleRefineIdea}
      isRefining={isRefining}
    />
  );
}
