import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/x-pdf': ['.pdf'],
  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.tif', '.heic', '.heif'],
};

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'tif', 'heic', 'heif'];

export default function FileUpload({ onFileSelected, isLoading, onSelectSample }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrorMessage('');

    const fileToProcess = (acceptedFiles && acceptedFiles[0]) || (rejectedFiles && rejectedFiles[0]?.file);

    if (fileToProcess) {
      const ext = fileToProcess.name.split('.').pop()?.toLowerCase() || '';

      if (fileToProcess.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`File exceeds the limit (${(fileToProcess.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      if (!ALLOWED_EXTENSIONS.includes(ext) && !fileToProcess.type.startsWith('image/') && !fileToProcess.type.includes('pdf')) {
        setErrorMessage('Unsupported format. Please upload a PDF or supported image (PNG, JPG, WEBP, BMP, TIFF, HEIC).');
        return;
      }

      setSelectedFile(fileToProcess);
      return;
    }

    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error?.code === 'file-too-large') {
        setErrorMessage(`File exceeds the limit. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
      } else {
        setErrorMessage('Unsupported file format. Please upload a PDF or supported image file.');
      }
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Central Hero Heading */}
      <div className="text-center space-y-2.5 pt-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Understand your documents. Instantly.
        </h1>
        <p className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Upload a PDF or scanned document and let AI extract, understand, and summarize it.
        </p>
      </div>

      {/* Upload Drop Area / Selected Document Card */}
      <div
        {...getRootProps()}
        className={`relative border rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragActive && !isDragReject
            ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 ring-4 ring-brand-500/10 scale-[1.005]'
            : isDragReject
            ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
            : selectedFile
            ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-card'
            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/60 dark:hover:bg-zinc-900 shadow-subtle'
        } ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          /* Document Ready State */
          <div className="space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-subtle">
              {selectedFile.type?.includes('pdf') || selectedFile.name?.toLowerCase().endsWith('.pdf') ? (
                <FileText className="w-6 h-6" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-[15px] font-semibold text-zinc-950 dark:text-white truncate max-w-md mx-auto">
                {selectedFile.name}
              </h3>
              <div className="flex items-center justify-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="uppercase font-medium">{selectedFile.name.split('.').pop() || 'File'}</span>
                <span>•</span>
                <span>{formatFileSize(selectedFile.size)}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Ready to analyze
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>

              <button
                type="button"
                onClick={handleStartProcessing}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-subtle transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Document</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty Dropzone State */
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center border border-zinc-200/80 dark:border-zinc-700/80 shadow-subtle">
              <Upload className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </div>

            <div className="space-y-1">
              <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                {isDragActive ? 'Drop your document here' : 'Drop your document here'}
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                or <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Browse files</span>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              <span>PDF</span>
              <span>•</span>
              <span>PNG</span>
              <span>•</span>
              <span>JPG</span>
              <span>•</span>
              <span>JPEG</span>
              <span>•</span>
              <span>WEBP</span>
              <span>•</span>
              <span>Max {MAX_FILE_SIZE_MB}MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Unable to accept file</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Sample Documents Section */}
      {!selectedFile && (
        <div className="pt-2 text-center space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Or test with a sample document
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => onSelectSample('ai_research')}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-subtle transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span>Edge AI Research Paper (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectSample('meeting_notes')}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-subtle transition-all"
            >
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span>Strategy Notes (OCR Image)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
