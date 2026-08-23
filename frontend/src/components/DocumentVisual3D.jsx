import React, { useState, useEffect, useRef } from 'react';
import { FileText, Sparkles, Check, Layers, Zap } from 'lucide-react';

export default function DocumentVisual3D({ isScanning = false, isDragOver = false, stage = 'idle' }) {
  const [rotate, setRotate] = useState({ x: 10, y: -12 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      // Only apply on screens wider than tablet
      if (window.innerWidth < 768 || isScanning) return;

      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14; // ±7 deg
      const y = -(e.clientY / innerHeight - 0.5) * 14; // ±7 deg
      setRotate({ x: 10 + y, y: -12 + x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isScanning]);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] mx-auto perspective-1000 select-none flex items-center justify-center">
      
      {/* Ambient background glow behind 3D stack */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 via-violet-600/15 to-transparent rounded-full blur-2xl transform scale-110 pointer-events-none animate-pulse-glow" />

      {/* 3D Transform Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-full preserve-3d transition-transform duration-300 ease-out ${
          isDragOver ? 'scale-105' : 'animate-float-slow'
        }`}
        style={{
          transform: `rotateX(${isDragOver ? 4 : rotate.x}deg) rotateY(${isDragOver ? -4 : rotate.y}deg) rotateZ(-2deg)`,
        }}
      >
        {/* Layer 3: Back Bottom Sheet */}
        <div
          className="absolute inset-x-4 inset-y-2 rounded-2xl bg-slate-200/90 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-md transform -translate-x-3 translate-y-4 -rotate-3"
          style={{ transform: 'translateZ(-24px) rotate(-4deg)' }}
        />

        {/* Layer 2: Middle Sheet */}
        <div
          className="absolute inset-x-2 inset-y-1 rounded-2xl bg-slate-100/95 dark:bg-slate-850 dark:bg-[#141b2d] border border-slate-300 dark:border-slate-700 shadow-lg transform -translate-x-1.5 translate-y-2 -rotate-1.5"
          style={{ transform: 'translateZ(-12px) rotate(-2deg)' }}
        >
          {/* Subtle document lines */}
          <div className="p-5 space-y-2 opacity-40">
            <div className="w-1/3 h-2 bg-slate-400 dark:bg-slate-600 rounded" />
            <div className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded" />
            <div className="w-4/5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
        </div>

        {/* Layer 1: Front Primary Document Sheet */}
        <div
          className={`absolute inset-0 rounded-2xl bg-white dark:bg-[#111827] border ${
            isDragOver
              ? 'border-brand-500 shadow-glow-brand ring-2 ring-brand-500/20'
              : isScanning
              ? 'border-brand-400 shadow-card-hover'
              : 'border-slate-200/90 dark:border-slate-700/90 shadow-2xl'
          } p-5 flex flex-col justify-between overflow-hidden transition-all duration-300`}
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Top Document Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-brand-600 to-violetAccent-500 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                  Research_Paper.pdf
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">
                  PyMuPDF • OCR Ready
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-brand-500" />
                AI
              </span>
            </div>
          </div>

          {/* Document Simulated Body with AI Highlights */}
          <div className="space-y-2.5 py-2 flex-1">
            <div className="w-3/4 h-2.5 bg-slate-800 dark:bg-slate-200 rounded-sm" />
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded" />
              <div className="w-11/12 h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded" />
              {/* Highlighted Insight sentence */}
              <div className="w-full h-2 bg-gradient-to-r from-brand-500/25 via-violet-500/25 to-brand-500/25 dark:from-brand-500/35 dark:to-violet-500/35 rounded border-l-2 border-brand-500" />
              <div className="w-4/5 h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded" />
            </div>

            <div className="pt-1.5 space-y-1.5">
              <div className="w-1/2 h-2 bg-slate-700 dark:bg-slate-300 rounded-sm" />
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded" />
              <div className="w-5/6 h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded" />
            </div>
          </div>

          {/* Bottom Card Summary Pill */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[10px]">
            <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <Zap className="w-3 h-3 text-brand-500" />
              <span>Multi-Strategy Pipeline</span>
            </div>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
              PDF + OCR + AI
            </span>
          </div>

          {/* Scanning Line Animation Effect */}
          {isScanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline pointer-events-none" />
          )}

        </div>

      </div>

    </div>
  );
}
