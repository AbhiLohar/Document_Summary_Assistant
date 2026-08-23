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
  Layers,
  Shield,
} from 'lucide-react';
import DocumentVisual3D from './DocumentVisual3D';

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
        setErrorMessage(`File exceeds size limit (${(fileToProcess.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      if (!ALLOWED_EXTENSIONS.includes(ext) && !fileToProcess.type.startsWith('image/') && !fileToProcess.type.includes('pdf')) {
        setErrorMessage('Unsupported format. Please upload a PDF or image (PNG, JPG, WEBP, BMP, TIFF, HEIC).');
        return;
      }

      setSelectedFile(fileToProcess);
      return;
    }

    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error?.code === 'file-too-large') {
        setErrorMessage(`File exceeds size limit. Maximum allowed is ${MAX_FILE_SIZE_MB}MB.`);
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
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in">
      
      {/* Top Hero Section */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Next-Gen Document Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          Understand your documents.{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 dark:from-brand-400 dark:via-indigo-400 dark:to-violet-400">
            Instantly.
          </span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI-powered extraction, summarization, and insights for PDFs and scanned documents.
        </p>
      </div>

      {/* Main Interactive Grid: 2.5D Visual + Upload Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        
        {/* Left Column: 2.5D Document Stack */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <DocumentVisual3D isDragOver={isDragActive} isScanning={isLoading} />
        </div>

        {/* Right Column: Upload Card */}
        <div className="lg:col-span-7">
          <div
            {...getRootProps()}
            className={`relative rounded-3xl p-7 sm:p-10 text-center cursor-pointer transition-all duration-300 border ${
              isDragActive && !isDragReject
                ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30 shadow-glow-brand ring-4 ring-brand-500/15 scale-[1.01]'
                : isDragReject
                ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                : selectedFile
                ? 'border-brand-300 dark:border-brand-700 bg-white dark:bg-[#0f172a] shadow-card-hover'
                : 'border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-[#0f172a]/90 hover:border-brand-300 dark:hover:border-brand-700 shadow-card hover:shadow-card-hover'
            } ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />

            {selectedFile ? (
              /* Selected Document Preview State */
              <div className="space-y-5" onClick={(e) => e.stopPropagation()}>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
                  {selectedFile.type?.includes('pdf') || selectedFile.name?.toLowerCase().endsWith('.pdf') ? (
                    <FileText className="w-7 h-7" />
                  ) : (
                    <ImageIcon className="w-7 h-7" />
                  )}
                </div>

                <div className="space-y-1.5 px-2">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white truncate max-w-sm mx-auto">
                    {selectedFile.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="uppercase">{selectedFile.name.split('.').pop() || 'FILE'}</span>
                    <span>•</span>
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Ready to analyze
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartProcessing}
                    disabled={isLoading}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 shadow-md shadow-brand-600/30 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5"
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
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-50 to-violet-50 dark:from-slate-800 dark:to-slate-800/80 border border-brand-200/60 dark:border-slate-700 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                    {isDragActive ? 'Drop to analyze instantly' : 'Drop your document here'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    or <span className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Browse files</span> from your device
                  </p>
                </div>

                {/* Format Pills */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300">PDF</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300">PNG</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300">JPG</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300">WEBP</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300">BMP</span>
                  <span className="text-slate-400 dark:text-slate-500">• Max {MAX_FILE_SIZE_MB}MB</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-start space-x-3 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-bold">Unable to process file</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Sample Documents Section */}
      {!selectedFile && (
        <div className="pt-2 text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Or try with a sample document
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onSelectSample('ai_research')}
              disabled={isLoading}
              className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Edge AI Research Paper (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectSample('meeting_notes')}
              disabled={isLoading}
              className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <ImageIcon className="w-4 h-4 text-violetAccent-500" />
              <span>Strategy Notes (OCR Image)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
