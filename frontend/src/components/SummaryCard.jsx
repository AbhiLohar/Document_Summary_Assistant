import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Layers,
} from 'lucide-react';

export default function SummaryCard({ summary, summaryLength, isHierarchical }) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const wordCount = summary ? summary.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-card space-y-5 relative">
      
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-subtle">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
              AI Summary
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {summaryLength ? `${summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)} Mode` : 'Executive Summary'} • {wordCount} words
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          {/* TTS Button */}
          <button
            type="button"
            onClick={handleSpeak}
            aria-label="Listen to summary"
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950 dark:border-brand-700 dark:text-brand-300 animate-pulse'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
            title={isSpeaking ? 'Stop audio' : 'Read aloud'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-subtle"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hierarchical note */}
      {isHierarchical && (
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs text-zinc-700 dark:text-zinc-300 flex items-center space-x-2">
          <Layers className="w-4 h-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
          <span>
            <strong>Hierarchical Synthesis:</strong> Content was analyzed across multiple sections and synthesized into this unified document summary.
          </span>
        </div>
      )}

      {/* Markdown Body */}
      <div className="prose-editorial">
        <ReactMarkdown>{summary || 'No summary generated.'}</ReactMarkdown>
      </div>

    </div>
  );
}
