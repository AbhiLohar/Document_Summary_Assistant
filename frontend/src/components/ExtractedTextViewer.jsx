import React, { useState, useMemo } from 'react';
import {
  FileCode2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Search,
  Hash,
  Layers,
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

  const filteredText = useMemo(() => {
    if (!searchTerm.trim()) return extractedText;
    return extractedText;
  }, [extractedText, searchTerm]);

  const matchCount = useMemo(() => {
    if (!searchTerm.trim() || !extractedText) return 0;
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = extractedText.match(regex);
    return matches ? matches.length : 0;
  }, [extractedText, searchTerm]);

  if (!extractedText) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      
      {/* Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <FileCode2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Raw Extracted Text
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {metadata?.extraction_method || 'Parser Output'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify the exact OCR / PDF text before AI processing • {lineCount} lines • {extractedText.length.toLocaleString()} characters
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Content Area */}
      {isOpen && (
        <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          
          {/* Controls Bar: Search & Copy */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pb-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search within extracted text..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchTerm && (
                <span className="absolute right-3 top-2 text-[11px] text-slate-400">
                  {matchCount} match{matchCount !== 1 ? 'es' : ''}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs ml-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Text</span>
                </>
              )}
            </button>
          </div>

          {/* Scrollable Preformatted Text Box */}
          <div className="relative rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs max-h-96 overflow-y-auto overflow-x-auto shadow-inner border border-slate-800 leading-relaxed select-text">
            <pre className="whitespace-pre-wrap font-mono">
              {filteredText}
            </pre>
          </div>

        </div>
      )}

    </div>
  );
}
