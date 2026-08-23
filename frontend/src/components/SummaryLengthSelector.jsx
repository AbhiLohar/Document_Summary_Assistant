import React from 'react';
import { AlignLeft, FileText, BookOpen, Loader2 } from 'lucide-react';

export default function SummaryLengthSelector({ currentLength, onLengthChange, isRegenerating }) {
  const options = [
    {
      id: 'short',
      label: 'Short',
      desc: '3–5 sentences • Key takeaways',
      icon: AlignLeft,
    },
    {
      id: 'medium',
      label: 'Medium',
      desc: '1–3 paragraphs • Context & findings',
      icon: FileText,
    },
    {
      id: 'long',
      label: 'Long',
      desc: 'Detailed sections • In-depth coverage',
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
      <div className="px-3 py-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Summary Length
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center">
        {options.map((opt) => {
          const isSelected = currentLength === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onLengthChange(opt.id)}
              disabled={isRegenerating}
              className={`flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md shadow-slate-200 dark:shadow-none border border-slate-200/60 dark:border-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              } ${isRegenerating && isSelected ? 'animate-pulse' : ''}`}
              title={opt.desc}
            >
              {isRegenerating && isSelected ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
              ) : (
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-500' : 'text-slate-400'}`} />
              )}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
