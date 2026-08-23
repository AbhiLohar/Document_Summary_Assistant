import React from 'react';
import {
  FileText,
  FileCheck2,
  Clock,
  Layers,
  Hash,
  RotateCcw,
  Download,
  Share2,
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
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: File Name and Badges */}
        <div className="flex items-start space-x-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-lg" title={metadata.filename}>
              {metadata.filename}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {metadata.file_type}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {formatBytes(metadata.file_size_bytes)}
              </span>
              {metadata.page_count > 1 && (
                <>
                  <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center">
                    <Layers className="w-3 h-3 mr-1 text-slate-400" />
                    {metadata.page_count} Pages
                  </span>
                </>
              )}
              {metadata.is_scanned && (
                <>
                  <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    OCR Processed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle Stats */}
        <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-6 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <div className="text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Words</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {metadata.word_count?.toLocaleString() || 0}
            </p>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <div className="text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Read Time</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              ~{readingTimeMin} min
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2 pt-2 md:pt-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/80 hover:bg-brand-100 dark:hover:bg-brand-900/60 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Upload another document"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>New File</span>
          </button>
        </div>

      </div>
    </div>
  );
}
