import React from 'react';
import { Compass } from 'lucide-react';

export default function MainIdeasCard({ mainIdeas = [] }) {
  if (!mainIdeas || mainIdeas.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-2.5 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
          <Compass className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
            Main Ideas & Sections
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Key thematic topics identified across document sections
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {mainIdeas.map((idea, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-1.5"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
              <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {idea.title}
              </h4>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-3.5">
              {idea.summary}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
