import React from 'react';
import { AlertCircle, RotateCcw, Key, X, ExternalLink, Clock } from 'lucide-react';

export default function ErrorAlert({ error, onRetry, onOpenApiKeyModal, onDismiss }) {
  if (!error) return null;

  const errorLower = error.toLowerCase();
  const isRateLimit =
    errorLower.includes('429') ||
    errorLower.includes('rate limit') ||
    errorLower.includes('quota') ||
    errorLower.includes('resource_exhausted');

  const isKeyError =
    isRateLimit ||
    errorLower.includes('api key') ||
    errorLower.includes('gemini') ||
    errorLower.includes('unauthenticated') ||
    errorLower.includes('authentication');

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 shadow-subtle animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            {isRateLimit ? <Clock className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100">
              {isRateLimit ? 'Gemini API Rate Limit / Quota Exceeded' : 'Unable to Process Document'}
            </h4>
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
              {error}
            </p>

            {isRateLimit && (
              <p className="text-[11px] text-rose-700 dark:text-rose-400 pt-0.5">
                💡 <strong>Tip:</strong> Free tier limits requests to 15/min. Please wait ~20–30 seconds and click <em>Try Again</em>, or switch to a new free API key.
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {isKeyError && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white shadow-subtle transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Configure API Key</span>
                </button>
              )}

              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 dark:hover:bg-rose-800 text-rose-900 dark:text-rose-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  <span>Try Again</span>
                </button>
              )}

              {isRateLimit && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-rose-800 dark:text-rose-300 hover:underline"
                >
                  <span>Get New Key</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
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
