import React from 'react';
import {
  FileText,
  BookOpen,
  Sparkles,
  Binary,
  Layers,
  FileSpreadsheet,
  FileCode2,
  Bookmark,
  Cpu,
  Brain,
} from 'lucide-react';

export default function BackgroundArtwork({ isFrontPage = true }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      
      {/* Layer 1: Ambient Radial Glow Orbs */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-violet-600/20 via-brand-600/15 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl" />

      {/* Layer 2: Theme Abstract Vector Stream (Data Lines & Connecting Paths) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.14] text-brand-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
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
          
          {/* ======================================================== */}
          {/* 1. TOP-LEFT: Floating Glass Document Stack with Live Glow */}
          {/* ======================================================== */}
          <div className="absolute top-[8%] left-[2%] sm:left-[4%] xl:left-[6%] animate-float-drift-1 opacity-85 dark:opacity-90 transition-all duration-700">
            <div className="w-40 sm:w-48 h-52 sm:h-60 rounded-2xl bg-white/85 dark:bg-[#0e1628]/85 backdrop-blur-xl border border-indigo-200/80 dark:border-indigo-500/30 shadow-2xl shadow-indigo-500/20 p-4 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50/90 dark:bg-brand-950/80 px-2 py-0.5 rounded-full border border-brand-200/80 dark:border-brand-800/80 shadow-xs">
                  DOC • AI
                </span>
              </div>
              <div className="space-y-2.5 my-auto">
                <div className="h-2.5 w-3/4 bg-gradient-to-r from-brand-500/40 to-violet-500/40 rounded-full" />
                <div className="h-1.5 w-full bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                <div className="h-1.5 w-5/6 bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                <div className="h-1.5 w-4/5 bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                <div className="h-1.5 w-2/3 bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-brand-500" />
                  <span>Executive Paper</span>
                </span>
                <span className="text-emerald-500 font-bold">Processed</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. TOP-RIGHT: Floating Open 3D Book with Spine & Pages   */}
          {/* ======================================================== */}
          <div className="absolute top-[10%] right-[2%] sm:right-[4%] xl:right-[6%] animate-float-drift-2 opacity-85 dark:opacity-90 transition-all duration-700">
            <div className="w-48 sm:w-56 h-36 sm:h-40 rounded-2xl bg-gradient-to-tr from-white/90 via-white/80 to-purple-50/80 dark:from-[#0d1527]/90 dark:via-[#0d1527]/80 dark:to-purple-950/40 backdrop-blur-xl border border-purple-200/80 dark:border-purple-500/30 shadow-2xl shadow-purple-500/20 p-3.5 flex transform rotate-6 hover:rotate-0 transition-transform">
              {/* Left Page */}
              <div className="w-1/2 pr-2.5 border-r border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-violet-600 dark:text-violet-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">Book Vol.1</span>
                  </div>
                  <Bookmark className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                </div>
                <div className="space-y-1.5 my-auto">
                  <div className="h-1.5 w-full bg-slate-300/70 dark:bg-slate-700/70 rounded-full" />
                  <div className="h-1.5 w-5/6 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                  <div className="h-1.5 w-4/5 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                </div>
                <span className="text-[8px] text-slate-400 font-mono">pg. 42</span>
              </div>
              {/* Right Page */}
              <div className="w-1/2 pl-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-end text-amber-500">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div className="space-y-1.5 my-auto">
                  <div className="h-1.5 w-full bg-indigo-300/50 dark:bg-indigo-700/50 rounded-full" />
                  <div className="h-1.5 w-5/6 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
                </div>
                <span className="text-[8px] text-slate-400 font-mono text-right">pg. 43</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. MID-LEFT: Floating 3D Glowing NLP / AI Data Cube Block */}
          {/* ======================================================== */}
          <div className="absolute top-[46%] left-[1%] sm:left-[3%] xl:left-[4%] animate-float-block opacity-80 dark:opacity-90 transition-all duration-700 hidden sm:block">
            <div className="w-32 sm:w-36 h-32 sm:h-36 rounded-3xl bg-gradient-to-br from-indigo-500/25 via-purple-600/15 to-transparent backdrop-blur-xl border border-indigo-400/40 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/25 p-3.5 flex flex-col justify-between transform rotate-12 hover:rotate-6 transition-transform">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-100 block">AI Neural Block</span>
                <span className="text-[8.5px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">Gemini 2.0 Flash</span>
              </div>
              <div className="flex space-x-1 pt-1">
                <div className="h-1.5 flex-1 bg-brand-500/80 rounded-full" />
                <div className="h-1.5 flex-1 bg-violet-500/80 rounded-full" />
                <div className="h-1.5 flex-1 bg-cyan-500/80 rounded-full" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. MID-RIGHT / BOTTOM-RIGHT: Floating LaTeX Math Sheet   */}
          {/* ======================================================== */}
          <div className="absolute top-[50%] right-[1%] sm:right-[3%] xl:right-[5%] animate-float-drift-3 opacity-80 dark:opacity-90 transition-all duration-700 hidden sm:block">
            <div className="w-40 sm:w-48 h-48 sm:h-56 rounded-2xl bg-white/85 dark:bg-[#0e1628]/85 backdrop-blur-xl border border-cyan-200/80 dark:border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-4 flex flex-col justify-between transform rotate-6 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">Knapsack_Proof.tex</span>
                <span className="text-[9px] font-mono font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-200/80 dark:border-cyan-800/80">
                  KaTeX
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-center font-mono text-[11px] text-brand-700 dark:text-brand-300 shadow-inner">
                <span>∫ f(x) dx = \sum w_i</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-300/60 dark:bg-slate-700/60 rounded-full" />
                <div className="h-1.5 w-4/5 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[8.5px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                <span>O(N log N)</span>
                <span className="text-emerald-500 font-bold">100% Math Match</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. BOTTOM-LEFT: Floating Research Paper & Data Block     */}
          {/* ======================================================== */}
          <div className="absolute bottom-[6%] left-[4%] sm:left-[8%] xl:left-[12%] animate-float-drift-4 opacity-75 dark:opacity-85 transition-all duration-700 hidden lg:block">
            <div className="w-48 h-36 rounded-2xl bg-white/80 dark:bg-[#0e1628]/80 backdrop-blur-xl border border-emerald-200/80 dark:border-emerald-500/30 shadow-xl shadow-emerald-500/15 p-3.5 flex flex-col justify-between transform -rotate-8 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">Financial Report</span>
                </div>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                  PDF
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 py-1">
                <div className="h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-mono font-bold text-slate-700 dark:text-slate-300">$45.8k</div>
                <div className="h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[9px] font-mono font-bold">+38%</div>
                <div className="h-6 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[9px] font-mono font-bold">2026</div>
              </div>
              <span className="text-[8.5px] text-slate-400 font-mono">12 Pages • PyMuPDF OCR</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 6. FLOATING INTERACTIVE MICRO-PILLS & NODES              */}
          {/* ======================================================== */}
          <div className="absolute top-[26%] left-[16%] xl:left-[20%] animate-float-orb-1 opacity-80 hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/85 dark:bg-[#0e1628]/85 backdrop-blur-xl border border-brand-300/80 dark:border-brand-500/40 text-[11px] font-mono font-bold text-brand-700 dark:text-brand-300 shadow-md shadow-brand-500/15">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span>OCR • 300 DPI</span>
          </div>

          <div className="absolute top-[30%] right-[16%] xl:right-[20%] animate-float-orb-2 opacity-80 hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/85 dark:bg-[#0e1628]/85 backdrop-blur-xl border border-violet-300/80 dark:border-violet-500/40 text-[11px] font-mono font-bold text-violet-700 dark:text-violet-300 shadow-md shadow-violet-500/15">
            <Binary className="w-3.5 h-3.5 text-violet-500" />
            <span>Multi-Modal AI</span>
          </div>

          <div className="absolute bottom-[16%] right-[18%] xl:right-[22%] animate-float-orb-1 opacity-80 hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/85 dark:bg-[#0e1628]/85 backdrop-blur-xl border border-cyan-300/80 dark:border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-300 shadow-md shadow-cyan-500/15">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>KaTeX Math Engine</span>
          </div>

        </div>
      )}

    </div>
  );
}
