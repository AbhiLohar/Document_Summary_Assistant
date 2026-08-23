import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, X, Check, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
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
    }, 500);
  };

  const handleClear = () => {
    setApiKeyInput('');
    setStoredApiKey('');
    setValidationResult(null);
    setValidationError('');
    if (onKeySaved) onKeySaved(backendHasKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-elevated border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
              <Key className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Google Gemini API Key
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Configure a Google Gemini API key to power document understanding and executive summarization.
          </p>

          {backendHasKey && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>
                Backend default key is active. You can enter a personal key below to override it.
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                API Key
              </label>
              {apiKeyInput.trim() && (
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isValidating}
                  className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center space-x-1"
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

            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                setValidationResult(null);
                setValidationError('');
              }}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Saved locally in browser localStorage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center"
              >
                <span>Get Free Gemini Key</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Validation Feedback */}
          {validationResult && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected Successfully</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Found {validationResult.models_count} supported model(s): {validationResult.available_models?.join(', ')}
              </p>
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Validation Failed</span>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">{validationError}</p>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>API key saved successfully.</span>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
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
                className="px-3.5 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl shadow-subtle transition-all"
              >
                Save Key
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
