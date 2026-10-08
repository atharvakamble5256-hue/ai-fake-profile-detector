import React from 'react';
import { ShieldAlert, Camera, BrainCircuit, Activity, Lock, ArrowDown } from 'lucide-react';

export default function HeroBanner({ onScrollToForm }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-blue-600/10 blur-[80px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Title Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-400 text-xs font-semibold mb-4 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-cyan-300" />
          <span>Real-Time Social Media Account Credibility & Bot Forensics</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
          AI-Powered Smart <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Fake Account Detector
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
          Analyze any social media account with 
          <span className="text-cyan-300 font-medium"> OpenCV facial biometric verification</span>, 
          Shannon syntactic entropy, and multi-factor heuristic risk scoring.
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={onScrollToForm}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Start Account Analysis</span>
            <ArrowDown className="w-4 h-4 ml-1 animate-bounce" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">OpenCV Vision</span>
            </div>
            <p className="text-[11px] text-slate-400">Haar cascade face bounding, sharpness & GAN detection</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">Syntactic Entropy</span>
            </div>
            <p className="text-[11px] text-slate-400">Shannon entropy & trailing digit bot script detection</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Explainable AI</span>
            </div>
            <p className="text-[11px] text-slate-400">Transparent signal breakdown with 0-100 impact scoring</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Privacy First</span>
            </div>
            <p className="text-[11px] text-slate-400">Local processing, no scraping, no private credentials required</p>
          </div>

        </div>

      </div>
    </div>
  );
}
