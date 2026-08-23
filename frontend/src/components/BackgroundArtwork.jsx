import React from 'react';

export default function BackgroundArtwork() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10">
      
      {/* Layer 1: Ambient Radial Lighting */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-violet-600/10 via-brand-600/5 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/8 via-indigo-500/5 to-transparent rounded-full blur-3xl" />

      {/* Layer 2: Theme A + Theme B Abstract Document Vector Stream (5-10% opacity) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.08] text-brand-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Floating Abstract Document Outlines (Theme A) */}
        <g transform="translate(60, 120) rotate(-12)">
          <rect x="0" y="0" width="130" height="170" rx="12" fill="none" stroke="url(#docGrad)" strokeWidth="1.5" />
          <line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="55" x2="110" y2="55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="20" y1="75" x2="95" y2="75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="20" y1="95" x2="105" y2="95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>

        <g transform="translate(1100, 200) rotate(15)">
          <rect x="0" y="0" width="140" height="180" rx="14" fill="none" stroke="url(#docGrad)" strokeWidth="1.5" />
          <line x1="24" y1="40" x2="90" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="24" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Flowing Data Stream Lines (Theme B) */}
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

        {/* Subtle AI Connection Nodes */}
        <circle cx="300" cy="450" r="3" fill="#8b5cf6" opacity="0.8" />
        <circle cx="600" cy="200" r="4" fill="#6366f1" opacity="0.9" />
        <circle cx="950" cy="380" r="3" fill="#06b6d4" opacity="0.8" />
        <circle cx="1100" cy="600" r="3" fill="#8b5cf6" opacity="0.8" />
      </svg>

    </div>
  );
}
