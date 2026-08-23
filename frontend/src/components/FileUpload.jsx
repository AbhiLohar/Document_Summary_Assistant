import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  File,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff', '.tif'],
};

export default function FileUpload({ onFileSelected, isLoading, onSelectSample }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrorMessage('');

    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error?.code === 'file-too-large') {
        setErrorMessage(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
      } else if (error?.code === 'file-invalid-type') {
        setErrorMessage('Unsupported file format. Please upload a PDF or supported image file (PNG, JPG, WEBP, BMP, TIFF).');
      } else {
        setErrorMessage(error?.message || 'Invalid file.');
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled: isLoading,
  });

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setErrorMessage('');
  };

  const handleStartProcessing = () => {
    if (selectedFile && onFileSelected) {
      onFileSelected(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive && !isDragReject
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
            : isDragReject
            ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
            : selectedFile
            ? 'border-brand-400 dark:border-brand-600 bg-brand-50/20 dark:bg-brand-950/10'
            : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-white dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900 shadow-sm'
        } ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          /* File Selected Preview State */
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
              {selectedFile.type.includes('pdf') ? (
                <FileText className="w-8 h-8" />
              ) : (
                <ImageIcon className="w-8 h-8" />
              )}
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate max-w-md mx-auto">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                onClick={handleStartProcessing}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Summarize</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop State */
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 border border-brand-200/60 dark:border-slate-700 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-md animate-float">
              <UploadCloud className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {isDragActive ? 'Drop your document here...' : 'Drag & Drop your document here'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                or <span className="text-brand-600 dark:text-brand-400 font-medium underline">browse files</span> from your computer
              </p>
            </div>

            {/* Supported Formats Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                PDF
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                PNG
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                JPG / JPEG
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                WEBP / BMP / TIFF
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] text-slate-500 dark:text-slate-400">
                Max {MAX_FILE_SIZE_MB}MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Upload Error</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Sample Selector */}
      {!selectedFile && (
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Or try with a sample document
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onSelectSample('ai_research')}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:shadow"
            >
              <FileText className="w-3.5 h-3.5 text-brand-500" />
              <span>Edge AI Research Paper (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectSample('meeting_notes')}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:shadow"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
              <span>Strategy Notes (OCR Image)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
