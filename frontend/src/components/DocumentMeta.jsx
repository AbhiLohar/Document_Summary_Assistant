import React from 'react';
import {
  FileText,
  Clock,
  Layers,
  Hash,
  ArrowLeft,
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
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left: Back button & Document Identity */}
        <div className="flex items-start space-x-3.5 min-w-0">
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex-shrink-0 mt-0.5"
            title="Back to upload"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white truncate max-w-xl" title={metadata.filename}>
              {metadata.filename}
            </h2>
            
            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {metadata.file_type || 'PDF'}
              </span>
              <span>•</span>
              <span>{formatBytes(metadata.file_size_bytes)}</span>
              
              {metadata.page_count > 1 && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <Layers className="w-3 h-3 mr-1" />
                    {metadata.page_count} pages
                  </span>
                </>
              )}

              <span>•</span>
              <span className="flex items-center font-medium text-zinc-700 dark:text-zinc-300">
                <Hash className="w-3 h-3 mr-0.5 text-zinc-400" />
                {metadata.word_count?.toLocaleString() || 0} words
              </span>

              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                ~{readingTimeMin} min read
              </span>

              {metadata.is_scanned && (
                <>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    OCR Processed
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Export & New File Actions */}
        <div className="flex items-center space-x-2 pt-2 sm:pt-0 self-end sm:self-center flex-shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-900 dark:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700/80 transition-all shadow-subtle"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>New Analysis</span>
          </button>
        </div>

      </div>
    </div>
  );
}
