import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';

export default function ImprovementSuggestionsCard({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) return null;

  const getSeverityBadge = (severity) => {
    const sev = (severity || 'medium').toLowerCase();
    if (sev === 'high') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          High Priority
        </span>
      );
    }
    if (sev === 'low' || sev === 'praise') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Good / Minor
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        Recommended
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('clarity') || cat.includes('readability')) {
      return <Lightbulb className="w-4 h-4 text-amber-500" />;
    }
    if (cat.includes('evidence') || cat.includes('context')) {
      return <Info className="w-4 h-4 text-blue-500" />;
    }
    return <AlertTriangle className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Improvement Suggestions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Actionable editorial feedback to enhance document impact
          </p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="grid grid-cols-1 gap-3 pt-1">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(item.category)}
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {item.category || 'General'}
                </span>
              </div>
              {getSeverityBadge(item.severity)}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
              {item.suggestion}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
