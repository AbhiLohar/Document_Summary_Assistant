import React from 'react';
import { Check, Loader2, FileText, Scan, Sparkles, Brain, Layers } from 'lucide-react';
import DocumentVisual3D from './DocumentVisual3D';

export default function ProcessingProgress({ currentStage, uploadProgress = 0, isScanned = false }) {
  const steps = [
    {
      id: 'upload',
      name: 'Document uploaded',
      desc: uploadProgress < 100 ? `${uploadProgress}% uploaded` : 'File received securely',
      icon: FileText,
    },
    {
      id: 'extract',
      name: 'Extracting text layout',
      desc: 'High-fidelity parser reading text and tables',
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
      name: 'Understanding document semantics',
      desc: 'Analyzing context and section hierarchies',
      icon: Brain,
    },
    {
      id: 'summarize',
      name: 'Synthesizing intelligence & summary',
      desc: 'Generating takeaways & editorial recommendations',
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

  const getProgressPercentage = () => {
    switch (currentStage) {
      case 'upload':
        return Math.min(30, Math.round(uploadProgress * 0.3));
      case 'extract':
        return 45;
      case 'ocr':
        return 65;
      case 'analyze':
        return 80;
      case 'summarize':
        return 95;
      case 'complete':
        return 100;
      default:
        return 10;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: 2.5D Scanning Visual */}
        <div className="md:col-span-5 flex justify-center">
          <DocumentVisual3D isScanning={true} stage={currentStage} />
        </div>

        {/* Right Column: Processing Stepper Card */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-6">
            
            {/* Header with spinning glow */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-200/60 dark:border-brand-800/60 shadow-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                    Analyzing Document
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI pipeline running across multi-tier models
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2.5 py-1 rounded-lg border border-brand-200/60 dark:border-brand-800/60">
                {getProgressPercentage()}%
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-600 to-violet-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Timeline Steps list */}
            <div className="space-y-3.5 pt-1">
              {steps.map((step) => {
                const status = getStepStatus(step.id);

                return (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3.5 transition-all duration-200 ${
                      status === 'upcoming' ? 'opacity-35' : 'opacity-100'
                    }`}
                  >
                    {/* Status Circle */}
                    <div className="mt-0.5 flex-shrink-0">
                      {status === 'completed' ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : status === 'current' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-brand-600 dark:border-brand-400 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-ping" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800" />
                      )}
                    </div>

                    {/* Step details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs sm:text-[13px] font-semibold truncate ${
                            status === 'current'
                              ? 'text-slate-950 dark:text-white'
                              : status === 'completed'
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {step.name}
                        </p>
                        {status === 'current' && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 animate-pulse font-semibold">
                            Processing
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
