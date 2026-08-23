import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Layers,
  FileCheck2,
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
    <div className="relative bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-5 overflow-hidden">
      
      {/* Decorative ambient gradient at the top of the card */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-600 via-violet-600 to-brand-400" />

      {/* Top Header & Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                AI Executive Summary
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                Generated
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {summaryLength ? `${summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)} Mode` : 'Executive'} • {wordCount} words
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {/* TTS Audio Player */}
          <button
            type="button"
            onClick={handleSpeak}
            aria-label="Listen to summary"
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-950 dark:border-brand-700 dark:text-brand-300 animate-pulse'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isSpeaking ? 'Stop audio' : 'Listen to summary'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
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
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs text-indigo-900 dark:text-indigo-200 flex items-center space-x-2.5">
          <Layers className="w-4 h-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
          <span>
            <strong>Hierarchical Synthesis:</strong> Content was analyzed across multiple sections and synthesized into this unified document summary.
          </span>
        </div>
      )}

      {/* Markdown Body with Editorial Typography & Safe Math Rendering */}
      <div className="prose-editorial pt-1">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {summary || 'No summary generated.'}
        </ReactMarkdown>
      </div>

    </div>
  );
}
