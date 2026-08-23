import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, X, Check, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, validateApiKey } from '../services/api';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved, backendHasKey }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getStoredApiKey());
      setSavedSuccess(false);
      setValidationResult(null);
      setValidationError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setValidationError('Please enter an API key to test.');
      return;
    }

    setIsValidating(true);
    setValidationError('');
    setValidationResult(null);

    try {
      const res = await validateApiKey(keyToTest);
      setValidationResult(res);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Key validation failed.';
      setValidationError(msg);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKeyInput);
    setSavedSuccess(true);
    if (onKeySaved) onKeySaved(Boolean(apiKeyInput.trim() || backendHasKey));
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKeyInput('');
    setStoredApiKey('');
    setValidationResult(null);
    setValidationError('');
    if (onKeySaved) onKeySaved(backendHasKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Google Gemini API Key
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This application connects to Google Gemini AI to analyze extracted text, generate structured summaries, key takeaways, and suggestions.
          </p>

          {backendHasKey && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>
                A server-side Gemini API key is configured in the backend environment. You can enter a personal key below to override it.
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Enter API Key
              </label>
              {apiKeyInput.trim() && (
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isValidating}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test Connection</span>
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setValidationResult(null);
                  setValidationError('');
                }}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Saved locally in browser localStorage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-0.5"
              >
                <span>Get Free Gemini Key</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </p>
          </div>

          {/* Validation Feedback */}
          {validationResult && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Connected Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Found {validationResult.models_count} supported model(s): {validationResult.available_models?.join(', ')}
              </p>
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Validation Failed</span>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">{validationError}</p>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>API key successfully saved!</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {apiKeyInput ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear Key
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save API Key</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
