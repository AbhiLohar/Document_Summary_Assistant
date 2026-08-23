import React from 'react';
import { AlertCircle, RotateCcw, Key, X } from 'lucide-react';

export default function ErrorAlert({ error, onRetry, onOpenApiKeyModal, onDismiss }) {
  if (!error) return null;

  const isKeyError =
    error.toLowerCase().includes('api key') ||
    error.toLowerCase().includes('gemini') ||
    error.toLowerCase().includes('quota') ||
    error.toLowerCase().includes('unauthenticated');

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Processing Encountered an Issue
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
              {error}
            </p>

            {/* Action buttons */}
            <div className="flex items-center space-x-3 mt-3">
              {isKeyError && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Configure Gemini API Key</span>
                </button>
              )}

              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 dark:hover:bg-rose-800/80 text-rose-800 dark:text-rose-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
}
