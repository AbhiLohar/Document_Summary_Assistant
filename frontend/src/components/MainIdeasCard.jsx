import React from 'react';
import { Compass, Bookmark } from 'lucide-react';

export default function MainIdeasCard({ mainIdeas = [] }) {
  if (!mainIdeas || mainIdeas.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/60 dark:border-violet-800/60">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Main Ideas & Important Sections
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key thematic topics identified across document structure
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {mainIdeas.map((idea, index) => (
          <div
            key={index}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700/80 hover:shadow-xs transition-all duration-200 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white truncate">
                {idea.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-4">
              {idea.summary}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
