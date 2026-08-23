import React from 'react';
import {
  FileText,
  Clock,
  Layers,
  Hash,
  ArrowLeft,
  Download,
  RotateCcw,
} from 'lucide-react';

export default function DocumentMeta({ metadata, onReset, onOpenExport }) {
  if (!metadata) return null;

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const readingTimeMin = Math.max(1, Math.round((metadata.word_count || 0) / 200));

  return (
    <div className="w-full bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left: Back button & Document Identity */}
        <div className="flex items-start space-x-3.5 min-w-0">
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0 mt-0.5 shadow-xs"
            title="Upload another document"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white truncate max-w-xl" title={metadata.filename}>
              {metadata.filename}
            </h2>
            
            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {metadata.file_type || 'PDF'}
              </span>
              <span>•</span>
              <span className="font-medium">{formatBytes(metadata.file_size_bytes)}</span>
              
              {metadata.page_count > 1 && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {metadata.page_count} pages
                  </span>
                </>
              )}

              <span>•</span>
              <span className="flex items-center font-medium text-slate-700 dark:text-slate-300">
                <Hash className="w-3.5 h-3.5 mr-0.5 text-slate-400" />
                {metadata.word_count?.toLocaleString() || 0} words
              </span>

              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                ~{readingTimeMin} min read
              </span>

              {metadata.is_scanned && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    OCR Processed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Export & New File Actions */}
        <div className="flex items-center space-x-2.5 pt-2 sm:pt-0 self-end sm:self-center flex-shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 shadow-md shadow-brand-600/25 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>

      </div>
    </div>
  );
}
