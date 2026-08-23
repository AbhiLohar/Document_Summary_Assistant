import React from 'react';
import { Compass, BookText, ChevronRight } from 'lucide-react';

export default function MainIdeasCard({ mainIdeas = [] }) {
  if (!mainIdeas || mainIdeas.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Main Ideas & Important Sections
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key topics dynamically identified from document structure
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {mainIdeas.map((idea, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between space-y-2"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {idea.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {idea.summary}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
