import React from 'react';
import { Check, Loader2, FileText, Scan, Sparkles, Brain, Layers } from 'lucide-react';

export default function ProcessingProgress({ currentStage, uploadProgress = 0, isScanned = false }) {
  const steps = [
    {
      id: 'upload',
      name: 'Document uploaded',
      desc: uploadProgress < 100 ? `${uploadProgress}% uploaded` : 'File received',
      icon: FileText,
    },
    {
      id: 'extract',
      name: 'Extracting text',
      desc: 'Parsing layout and structure via PyMuPDF',
      icon: Layers,
    },
    ...(isScanned
      ? [
          {
            id: 'ocr',
            name: 'Running OCR engine',
            desc: 'Detecting text from scanned page layers',
            icon: Scan,
          },
        ]
      : []),
    {
      id: 'analyze',
      name: 'Analyzing document',
      desc: 'Contextual semantics & hierarchical outline',
      icon: Brain,
    },
    {
      id: 'summarize',
      name: 'Generating summary',
      desc: 'Synthesizing key points & recommendations',
      icon: Sparkles,
    },
  ];

  const getStepStatus = (stepId) => {
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
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-card space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center flex-shrink-0">
          <Loader2 className="w-4 h-4 animate-spin text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Processing Document
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Analyzing content and synthesizing intelligence
          </p>
        </div>
      </div>

      {/* Upload percentage bar */}
      {currentStage === 'upload' && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-500 font-mono">
            <span>Uploading</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-zinc-900 dark:bg-white h-1.5 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="space-y-3.5 pt-1">
        {steps.map((step) => {
          const status = getStepStatus(step.id);

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3.5 transition-opacity duration-200 ${
                status === 'upcoming' ? 'opacity-35' : 'opacity-100'
              }`}
            >
              {/* Status Indicator Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {status === 'completed' ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : status === 'current' ? (
                  <div className="w-5 h-5 rounded-full border-2 border-brand-600 dark:border-brand-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-ping" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800" />
                )}
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs sm:text-[13px] font-medium truncate ${
                      status === 'current'
                        ? 'text-zinc-950 dark:text-white font-semibold'
                        : status === 'completed'
                        ? 'text-zinc-800 dark:text-zinc-200'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {step.name}
                  </p>
                  {status === 'current' && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
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
