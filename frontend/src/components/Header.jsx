import React from 'react';
import { FileText, Sparkles, Key, Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, onOpenApiKeyModal, hasApiKey, backendHealth }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center shadow-md sm:shadow-lg shadow-brand-500/20 text-white flex-shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                Document Summary Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex-shrink-0">
                <Sparkles className="w-3 h-3 mr-1 text-brand-500" /> AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block truncate">
              Upload documents, extract text with PyMuPDF & OCR, and generate intelligent summaries
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          {/* Health status badge */}
          {backendHealth && (
            <div className="hidden lg:flex items-center space-x-2 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className={`w-2 h-2 rounded-full ${backendHealth.status === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{backendHealth.status === 'healthy' ? 'Backend Ready' : 'Connecting...'}</span>
            </div>
          )}

          {/* API Key Status Button */}
          <button
            onClick={onOpenApiKeyModal}
            type="button"
            className={`inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${
              hasApiKey
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 hover:bg-amber-100 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">
              {hasApiKey ? 'Gemini Active' : 'API Key'}
            </span>
            <span className="xs:hidden sm:hidden">
              {hasApiKey ? 'Key' : 'Key'}
            </span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            aria-label="Toggle theme"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
