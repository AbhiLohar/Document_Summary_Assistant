import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Layers,
  FileCheck,
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden transition-all">
      
      {/* Top Banner & Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Summary
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {summaryLength ? `${summaryLength.toUpperCase()} Mode` : 'Executive Summary'} • {wordCount} words
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {/* TTS Button */}
          <button
            type="button"
            onClick={handleSpeak}
            aria-label="Listen to summary"
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950 dark:border-brand-700 dark:text-brand-300 animate-pulse'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
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
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-800 dark:text-indigo-300 flex items-center space-x-2">
          <Layers className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>
            <strong>Hierarchical Processing:</strong> Due to the large document size, content was processed section-by-section and synthesized into this unified summary.
          </span>
        </div>
      )}

      {/* Markdown Body */}
      <div className="prose-custom pt-1 text-slate-800 dark:text-slate-200 text-sm sm:text-base">
        <ReactMarkdown>{summary || 'No summary generated.'}</ReactMarkdown>
      </div>

    </div>
  );
}
