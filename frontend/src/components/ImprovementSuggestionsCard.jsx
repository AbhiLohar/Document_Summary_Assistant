import React from 'react';
import { Lightbulb, Info, AlertTriangle } from 'lucide-react';

export default function ImprovementSuggestionsCard({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) return null;

  const getSeverityBadge = (severity) => {
    const sev = (severity || 'medium').toLowerCase();
    if (sev === 'high') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          High Priority
        </span>
      );
    }
    if (sev === 'low' || sev === 'praise') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
          Minor
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        Recommended
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('clarity') || cat.includes('readability')) {
      return <Lightbulb className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (cat.includes('evidence') || cat.includes('data')) {
      return <Info className="w-3.5 h-3.5 text-blue-500" />;
    }
    return <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-2.5 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
            Improvement Suggestions
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Editorial feedback and structural recommendations
          </p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="grid grid-cols-1 gap-2.5 pt-1">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/80 space-y-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(item.category)}
                <span className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  {item.category || 'General'}
                </span>
              </div>
              {getSeverityBadge(item.severity)}
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-5.5">
              {item.suggestion}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
