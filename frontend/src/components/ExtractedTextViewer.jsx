import React, { useState, useMemo } from 'react';
import {
  FileCode2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Search,
} from 'lucide-react';

export default function ExtractedTextViewer({ extractedText = '', metadata = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = useMemo(() => {
    return extractedText ? extractedText.split('\n').length : 0;
  }, [extractedText]);

  const wordCount = useMemo(() => {
    return metadata?.word_count || (extractedText ? extractedText.split(/\s+/).filter(Boolean).length : 0);
  }, [extractedText, metadata]);

  const filteredText = useMemo(() => {
    return extractedText;
  }, [extractedText]);

  const matchCount = useMemo(() => {
    if (!searchTerm.trim() || !extractedText) return 0;
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = extractedText.match(regex);
    return matches ? matches.length : 0;
  }, [extractedText, searchTerm]);

  if (!extractedText) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-card overflow-hidden">
      
      {/* Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center">
            <FileCode2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white">
                Extracted Document Text
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {wordCount.toLocaleString()} words
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Verify raw text parsed from {metadata?.file_type?.toUpperCase() || 'document'} • {lineCount} lines
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-6 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pb-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search raw extracted text..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              {searchTerm && (
                <span className="absolute right-3 top-2 text-[10px] text-zinc-400 font-mono">
                  {matchCount} found
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-subtle ml-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Text</span>
                </>
              )}
            </button>
          </div>

          {/* Scrollable Text Viewer */}
          <div className="rounded-xl bg-zinc-950 text-zinc-200 p-4 font-mono text-xs max-h-80 overflow-y-auto overflow-x-auto border border-zinc-800 leading-relaxed select-text">
            <pre className="whitespace-pre-wrap font-mono">
              {filteredText}
            </pre>
          </div>

        </div>
      )}

    </div>
  );
}
