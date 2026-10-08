import React, { useState, useEffect } from 'react';
import { Shield, BrainCircuit, Camera, Cpu } from 'lucide-react';

export default function ScanningOverlay({ isScanning }) {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    { text: 'Parsing handle syntax & calculating Shannon entropy...', icon: BrainCircuit },
    { text: 'Executing OpenCV Haar Cascade facial detection...', icon: Camera },
    { text: 'Analyzing follower/following social network ratio...', icon: Cpu },
    { text: 'Scanning bio text for known phishing triggers & URL shorteners...', icon: Shield },
    { text: 'Synthesizing multi-factor explainable risk score...', icon: BrainCircuit },
  ];

  useEffect(() => {
    if (!isScanning) {
      setStageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  const CurrentIcon = stages[stageIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl shadow-cyan-500/10">
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 blur-[80px] pointer-events-none rounded-full" />

        {/* Radar Spinner */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
          {/* Inner ring */}
          <div className="absolute inset-3 rounded-full border border-cyan-500/20" />
          
          {/* Radar sweep */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400 radar-sweep" />

          {/* Center icon */}
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center z-10">
            <CurrentIcon className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Scan Title */}
        <h3 className="text-base font-bold text-white tracking-wide mb-2">
          AI Deep Scan In Progress
        </h3>

        {/* Dynamic status step */}
        <div className="h-10 flex items-center justify-center mb-4">
          <p className="text-xs font-mono text-cyan-300 animate-pulse px-2">
            {stages[stageIndex].text}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === stageIndex
                  ? 'w-6 bg-cyan-400'
                  : idx < stageIndex
                  ? 'w-2 bg-cyan-700'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <p className="text-[10px] text-slate-500 font-mono mt-4">
          Local OpenCV + Heuristic Risk Pipeline
        </p>
      </div>
    </div>
  );
}
