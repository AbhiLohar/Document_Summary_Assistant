import React from 'react';
import { FileText, Key, Sun, Moon, Plus, Github, ExternalLink } from 'lucide-react';

export default function Header({
  darkMode,
  setDarkMode,
  onOpenApiKeyModal,
  hasApiKey,
  backendHealth,
  onNewDocument,
  isComplete,
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0d12]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        
        {/* Left: Product Logo & Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-subtle flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>

          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-sm sm:text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight truncate">
              Document Intelligence
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
              v1.0
            </span>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          
          {/* New Document Button (When viewing results) */}
          {isComplete && onNewDocument && (
            <button
              type="button"
              onClick={onNewDocument}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 shadow-subtle transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">New Document</span>
            </button>
          )}

          {/* Backend Status Pill */}
          {backendHealth && (
            <div className="hidden md:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendHealth.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="text-[11px] font-medium">
                {backendHealth.status === 'healthy' ? 'Ready' : 'Connecting'}
              </span>
            </div>
          )}

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            type="button"
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              hasApiKey
                ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'Gemini Connected' : 'Set API Key'}
            </span>
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/AbhiLohar/Document_Summary_Assistant"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            aria-label="Toggle theme"
            className="p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </header>
  );
}
