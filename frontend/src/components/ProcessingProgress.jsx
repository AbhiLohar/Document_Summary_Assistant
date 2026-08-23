import React from 'react';
import { Loader2, CheckCircle2, FileText, Scan, BrainCircuit, Sparkles, Layers } from 'lucide-react';

export default function ProcessingProgress({ currentStage, uploadProgress = 0, isScanned = false }) {
  const steps = [
    {
      id: 'upload',
      name: 'Uploading Document',
      desc: uploadProgress < 100 ? `${uploadProgress}% uploaded` : 'Upload completed',
      icon: FileText,
    },
    {
      id: 'extract',
      name: 'Extracting Content',
      desc: 'Parsing text structure via PyMuPDF',
      icon: Layers,
    },
    ...(isScanned
      ? [
          {
            id: 'ocr',
            name: 'Running OCR Engine',
            desc: 'Detecting text from scanned pages / image',
            icon: Scan,
          },
        ]
      : []),
    {
      id: 'analyze',
      name: 'AI Document Understanding',
      desc: 'Contextual analysis and section breakdown',
      icon: BrainCircuit,
    },
    {
      id: 'summarize',
      name: 'Synthesizing Results',
      desc: 'Crafting summary, key points & recommendations',
      icon: Sparkles,
    },
  ];

  const getStepStatus = (stepId, index) => {
    const stageOrder = ['upload', 'extract', ...(isScanned ? ['ocr'] : []), 'analyze', 'summarize', 'complete'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const thisIndex = stageOrder.indexOf(stepId);

    if (currentStage === 'complete' || currentIndex > thisIndex) {
      return 'completed';
    }
    if (currentIndex === thisIndex) {
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mb-2 shadow-inner">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Processing Your Document
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Please wait a moment while we extract, analyze, and summarize the content
        </p>
      </div>

      {/* Upload percentage bar */}
      {currentStage === 'upload' && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress Steps list */}
      <div className="space-y-3 pt-2">
        {steps.map((step, idx) => {
          const status = getStepStatus(step.id, idx);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3.5 p-3 rounded-2xl transition-all duration-200 ${
                status === 'current'
                  ? 'bg-brand-50/80 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/80 shadow-sm'
                  : status === 'completed'
                  ? 'bg-slate-50/60 dark:bg-slate-800/30 text-slate-500'
                  : 'opacity-40'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  status === 'completed'
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : status === 'current'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : status === 'current' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-semibold truncate ${
                      status === 'current'
                        ? 'text-brand-950 dark:text-brand-200'
                        : status === 'completed'
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.name}
                  </p>
                  {status === 'current' && (
                    <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 animate-pulse">
                      In progress...
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
