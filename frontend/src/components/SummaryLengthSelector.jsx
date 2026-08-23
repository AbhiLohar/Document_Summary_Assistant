import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SummaryLengthSelector({ currentLength, onLengthChange, isRegenerating }) {
  const options = [
    {
      id: 'short',
      label: 'Short',
      desc: '3–5 sentences • Key takeaways',
    },
    {
      id: 'medium',
      label: 'Medium',
      desc: '1–3 paragraphs • Context & findings',
    },
    {
      id: 'long',
      label: 'Long',
      desc: 'Detailed sections • In-depth coverage',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80">
      <div className="px-3 py-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Summary Mode
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center">
        {options.map((opt) => {
          const isSelected = currentLength === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onLengthChange(opt.id)}
              disabled={isRegenerating}
              className={`flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-subtle border border-zinc-200/80 dark:border-zinc-700 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              } ${isRegenerating && isSelected ? 'animate-pulse' : ''}`}
              title={opt.desc}
            >
              {isRegenerating && isSelected ? (
                <Loader2 className="w-3 h-3 animate-spin text-brand-600 dark:text-brand-400" />
              ) : null}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
