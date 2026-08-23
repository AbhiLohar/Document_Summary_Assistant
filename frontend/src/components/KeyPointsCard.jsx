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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
            <ListOrdered className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
              Key Takeaways
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {keyPoints.length} core findings extracted from document
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
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
              <span>Copy Points</span>
            </>
          )}
        </button>
      </div>

      {/* Points list */}
      <div className="grid grid-cols-1 gap-2.5 pt-1">
        {keyPoints.map((point, index) => {
          const numStr = String(index + 1).padStart(2, '0');
          return (
            <div
              key={index}
              className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150"
            >
              <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500 flex-shrink-0 mt-0.5 select-none">
                {numStr}
              </span>
              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {point}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
