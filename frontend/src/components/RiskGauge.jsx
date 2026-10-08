import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

export default function RiskGauge({ score = 0, classification = 'Genuine', confidence = 85 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth score increment animation
    let start = 0;
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color config based on classification
  const getTheme = () => {
    if (score >= 70 || classification === 'Likely Fake') {
      return {
        strokeColor: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        textColor: 'text-rose-400',
        badgeBg: 'bg-rose-950/80 border-rose-800 text-rose-300',
        icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
        label: 'HIGH RISK / BOT DETECTED'
      };
    }
    if (score >= 35 || classification === 'Suspicious') {
      return {
        strokeColor: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-950/80 border-amber-800 text-amber-300',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        label: 'ELEVATED RISK / SUSPICIOUS'
      };
    }
    return {
      strokeColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 border-emerald-800 text-emerald-300',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      label: 'LOW RISK / AUTHENTIC PROFILE'
    };
  };

  const theme = getTheme();

  // SVG Gauge calculations (semi-circle arc)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle arc
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/70 border border-slate-800 rounded-2xl relative overflow-hidden">
      
      {/* Background radial glow */}
      <div 
        className="absolute -top-12 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-40 transition-colors duration-700"
        style={{ backgroundColor: theme.strokeColor }}
      />

      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Fake Probability Score
        </span>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Confidence: <span className="text-cyan-400 font-bold">{confidence}%</span>
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-56 h-36 flex items-center justify-center mt-2">
        <svg className="w-56 h-36 overflow-visible" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Dynamic Value Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={theme.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-300"
          />
        </svg>

        {/* Center Score Numbers */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <div className="flex items-baseline">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${theme.textColor}`}>
              {animatedScore}
            </span>
            <span className="text-sm font-semibold text-slate-500 ml-1">/100</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-0.5">
            Risk Index
          </span>
        </div>
      </div>

      {/* Classification Pill */}
      <div className={`mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide ${theme.badgeBg}`}>
        {theme.icon}
        <span>{classification.toUpperCase()}</span>
      </div>

      <p className="text-[11px] font-mono text-slate-400 mt-2 text-center">
        {theme.label}
      </p>

    </div>
  );
}
