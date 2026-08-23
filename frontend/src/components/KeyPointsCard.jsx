import React, { useState } from 'react';
import { ListOrdered, Copy, Check } from 'lucide-react';

export default function KeyPointsCard({ keyPoints = [] }) {
  const [copied, setCopied] = useState(false);

  if (!keyPoints || keyPoints.length === 0) return null;

  const handleCopyAll = () => {
    const formatted = keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Key Points
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {keyPoints.length} core takeaways extracted from document
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
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
              <span>Copy Points</span>
            </>
          )}
        </button>
      </div>

      {/* Points list */}
      <div className="grid grid-cols-1 gap-2.5 pt-1">
        {keyPoints.map((point, index) => (
          <div
            key={index}
            className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
              {index + 1}
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
