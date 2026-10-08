import React from 'react';
import { ShieldCheck, History, RefreshCw, Cpu, Download } from 'lucide-react';

export default function Navbar({
  systemOnline,
  opencvVersion,
  onOpenHistory,
  onResetForm,
  hasResult,
  onOpenExport
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={onResetForm}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">VERIF.AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                PRODUCTION
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI-Powered Smart Fake Account Detector</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* OpenCV & Backend Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">OpenCV Engine:</span>
            <span className="text-emerald-400 font-mono font-medium">
              {opencvVersion ? `v${opencvVersion}` : 'Active'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
          </div>

          {/* Export Report (Visible if report ready) */}
          {hasResult && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Report</span>
            </button>
          )}

          {/* History Modal Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Analysis History</span>
          </button>

          {/* Reset / New Analysis */}
          <button
            onClick={onResetForm}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Start new analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
