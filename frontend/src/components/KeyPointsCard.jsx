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
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Key Takeaways
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {keyPoints.length} core findings extracted from document
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
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
              <span>Copy Points</span>
            </>
          )}
        </button>
      </div>

      {/* Points list */}
      <div className="grid grid-cols-1 gap-3 pt-1">
        {keyPoints.map((point, index) => {
          const numStr = String(index + 1).padStart(2, '0');
          return (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700/80 hover:shadow-xs transition-all duration-200"
            >
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2 py-1 rounded-lg border border-brand-200/60 dark:border-brand-800/60 flex-shrink-0 mt-0.5 select-none">
                {numStr}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {point}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
