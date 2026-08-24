import React from 'react';
import { FileText, BookOpen, Sparkles, Binary, Layers, FileSpreadsheet } from 'lucide-react';

export default function BackgroundArtwork({ isFrontPage = true }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10">
      
      {/* Layer 1: Ambient Radial Glow Orbs */}
      <div className="absolute -top-40 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-violet-600/15 via-brand-600/10 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/8 to-transparent rounded-full blur-3xl" />

      {/* Layer 2: Theme Abstract Vector Stream (Data Lines & Connecting Paths) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05] dark:opacity-[0.08] text-brand-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M 50 350 C 300 450, 600 200, 950 380 S 1400 300, 1600 420"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          d="M 100 650 C 400 550, 750 750, 1100 600 S 1500 700, 1750 580"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Layer 3: Dynamic Floating Documents, Books & 3D Glass Blocks (Frontpage Only) */}
      {isFrontPage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          
          {/* --- ELEMENT 1: Floating Glass Document Page (Top-Left) --- */}
          <div className="absolute top-[8%] left-[3%] sm:left-[6%] lg:left-[8%] animate-float-drift-1 opacity-70 dark:opacity-80 transition-opacity duration-700">
            <div className="w-36 sm:w-44 h-48 sm:h-56 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-slate-700/60 shadow-xl shadow-indigo-500/10 p-3.5 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-1.5 py-0.5 rounded border border-brand-200/60 dark:border-brand-800/60">
                  PDF • AI
                </span>
              </div>
              <div className="space-y-2 my-auto">
                <div className="h-2 w-3/4 bg-slate-300/70 dark:bg-slate-700/70 rounded-full" />
                <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                <div className="h-1.5 w-5/6 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                <div className="h-1.5 w-4/5 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-brand-500" />
                  <span>Executive Brief</span>
                </span>
                <span className="text-emerald-500 font-semibold">98%</span>
              </div>
            </div>
          </div>

          {/* --- ELEMENT 2: Floating Open Book / Dual-Page Document (Top-Right) --- */}
          <div className="absolute top-[12%] right-[4%] sm:right-[7%] lg:right-[9%] animate-float-drift-2 opacity-65 dark:opacity-75 transition-opacity duration-700">
            <div className="w-44 sm:w-52 h-32 sm:h-36 rounded-2xl bg-gradient-to-tr from-white/80 via-white/60 to-indigo-50/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-indigo-950/40 backdrop-blur-md border border-white/80 dark:border-slate-700/60 shadow-xl shadow-purple-500/10 p-3 flex transform rotate-8 hover:rotate-0 transition-transform">
              {/* Left Page */}
              <div className="w-1/2 pr-2 border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-violet-500" />
                  <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Chapter 01</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                  <div className="h-1.5 w-4/5 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                </div>
                <span className="text-[8px] text-slate-400 font-mono">pg. 14</span>
              </div>
              {/* Right Page */}
              <div className="w-1/2 pl-2 flex flex-col justify-between">
                <div className="flex items-center justify-end">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-5/6 bg-indigo-200/60 dark:bg-indigo-900/60 rounded-full" />
                  <div className="h-1.5 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
                </div>
                <span className="text-[8px] text-slate-400 font-mono text-right">pg. 15</span>
              </div>
            </div>
          </div>

          {/* --- ELEMENT 3: Floating 3D Isometric Glass Block (Mid-Left) --- */}
          <div className="absolute top-[48%] left-[2%] sm:left-[4%] lg:left-[5%] animate-float-block opacity-60 dark:opacity-75 transition-opacity duration-700 hidden sm:block">
            <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent backdrop-blur-lg border border-indigo-400/30 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/20 p-3 flex flex-col justify-between transform rotate-12">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shadow-md">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-200 block">NLP Block</span>
                <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-mono font-medium">Embedding: 768d</span>
              </div>
              <div className="flex space-x-1">
                <div className="h-1 flex-1 bg-brand-500/60 rounded-full" />
                <div className="h-1 flex-1 bg-violet-500/60 rounded-full" />
                <div className="h-1 flex-1 bg-cyan-500/60 rounded-full" />
              </div>
            </div>
          </div>

          {/* --- ELEMENT 4: Floating Math & Formula Document (Bottom-Right) --- */}
          <div className="absolute top-[52%] right-[3%] sm:right-[5%] lg:right-[7%] animate-float-drift-3 opacity-65 dark:opacity-75 transition-opacity duration-700 hidden sm:block">
            <div className="w-36 sm:w-44 h-44 sm:h-52 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-slate-700/60 shadow-xl shadow-cyan-500/10 p-3.5 flex flex-col justify-between transform rotate-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <span className="text-[9px] font-mono font-semibold text-slate-500 dark:text-slate-400">Research.tex</span>
                <span className="text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-200/60 dark:border-cyan-800/60">
                  LaTeX
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-700/40 text-center font-mono text-[10px] text-brand-700 dark:text-brand-300">
                <span>∫ f(x) dx = \sum w_i</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                <div className="h-1.5 w-3/4 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono pt-1">
                <span>O(N log N)</span>
                <span className="text-emerald-500">Verified</span>
              </div>
            </div>
          </div>

          {/* --- ELEMENT 5: Floating Document Stack & Research Report (Bottom-Left) --- */}
          <div className="absolute bottom-[8%] left-[5%] sm:left-[10%] lg:left-[14%] animate-float-drift-4 opacity-60 dark:opacity-70 transition-opacity duration-700 hidden lg:block">
            <div className="w-40 h-32 rounded-2xl bg-white/60 dark:bg-slate-900/50 backdrop-blur-md border border-white/80 dark:border-slate-700/60 shadow-lg shadow-indigo-500/10 p-3 flex flex-col justify-between transform -rotate-10">
              <div className="flex items-center space-x-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">Financial Overview</span>
              </div>
              <div className="grid grid-cols-3 gap-1 py-1">
                <div className="h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-mono font-semibold text-slate-600 dark:text-slate-300">$12.4k</div>
                <div className="h-5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[8px] font-mono font-semibold">+24%</div>
                <div className="h-5 rounded bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[8px] font-mono font-semibold">Q3</div>
              </div>
              <span className="text-[8px] text-slate-400 font-mono">3 Pages • Extracted</span>
            </div>
          </div>

          {/* --- ELEMENT 6: Floating Micro Chips / AI Node Orbs --- */}
          <div className="absolute top-[28%] left-[18%] animate-float-orb-1 opacity-70 hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-brand-200/80 dark:border-brand-800/80 text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
            <span>OCR 300 DPI</span>
          </div>

          <div className="absolute top-[32%] right-[18%] animate-float-orb-2 opacity-70 hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-violet-200/80 dark:border-violet-800/80 text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 shadow-sm">
            <Binary className="w-3 h-3 text-violet-500" />
            <span>Multi-Modal AI</span>
          </div>

          <div className="absolute bottom-[20%] right-[22%] animate-float-orb-1 opacity-70 hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-cyan-200/80 dark:border-cyan-800/80 text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>KaTeX Math Engine</span>
          </div>

        </div>
      )}

    </div>
  );
}
