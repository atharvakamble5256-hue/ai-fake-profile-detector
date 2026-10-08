import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

import RiskGauge from './RiskGauge';
import FaceAnalysisCard from './FaceAnalysisCard';
import ChartsSection from './ChartsSection';
import ReasonsBreakdown from './ReasonsBreakdown';
import RecommendationsCard from './RecommendationsCard';

export default function AnalysisResults({
  report,
  onReset,
  onOpenExport
}) {
  if (!report) return null;

  useEffect(() => {
    // If Genuine, fire celebratory confetti
    if (report.classification === 'Genuine') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#3b82f6']
        });
      } catch {
        // Safe fallback
      }
    }
  }, [report.id, report.classification]);

  const followers = report.followers_count || 0;
  const following = report.following_count || 0;
  const ratio = followers / Math.max(1, following);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Account Profile Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md print-card">
        
        {/* Glow accent bar at top */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          report.classification === 'Likely Fake'
            ? 'bg-rose-500 shadow-rose-500/50 shadow-md'
            : report.classification === 'Suspicious'
            ? 'bg-amber-500 shadow-amber-500/50 shadow-md'
            : 'bg-emerald-500 shadow-emerald-500/50 shadow-md'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          
          {/* Identity info */}
          <div className="flex items-start sm:items-center gap-4">
            
            {/* Avatar thumbnail */}
            <div className="relative shrink-0">
              {report.profile_image_preview ? (
                <img
                  src={report.profile_image_preview}
                  alt={report.username}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-2xl text-slate-300">
                  {report.username.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Status dot */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                report.classification === 'Likely Fake'
                  ? 'bg-rose-500'
                  : report.classification === 'Suspicious'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}>
                {report.classification === 'Likely Fake' ? (
                  <ShieldAlert className="w-3 h-3 text-white" />
                ) : report.classification === 'Suspicious' ? (
                  <AlertTriangle className="w-3 h-3 text-white" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-white" />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {report.display_name || report.username}
                </h2>
                {report.is_verified && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
                    ✓ VERIFIED
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono uppercase">
                  {report.platform}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-mono text-cyan-400 mb-2">
                @{report.username}
              </p>

              {report.bio && (
                <p className="text-xs text-slate-300 line-clamp-2 max-w-xl leading-relaxed italic">
                  "{report.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Followers</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {followers.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Following</span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {following.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Ratio</span>
              <span className={`text-xs sm:text-sm font-bold ${
                ratio < 0.2 ? 'text-rose-400' : ratio > 1.0 ? 'text-emerald-400' : 'text-slate-300'
              }`}>
                {ratio.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Action button bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analysis Generated: {new Date(report.created_at).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExport}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Report (PDF / JSON)</span>
            </button>
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Analyze Another Account</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Score & Verdict Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Radial Score Gauge */}
        <div className="lg:col-span-1 print-card">
          <RiskGauge
            score={report.risk_score}
            classification={report.classification}
            confidence={report.confidence_score}
          />
        </div>

        {/* Right: Detailed Verdict Narrative */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between print-card">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Executive Threat Evaluation
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              {report.classification === 'Likely Fake'
                ? 'High Probability Automated Impersonator / Bot Farm'
                : report.classification === 'Suspicious'
                ? 'Anomalous Account Footprint Requiring Verification'
                : 'Verified Organic Social Media Identity'}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {report.verdict_summary}
            </p>
          </div>

          {/* Quick Risk Indicator Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Bot Likelihood</span>
              <span className={`font-bold ${
                report.risk_score > 60 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {report.risk_score > 60 ? 'HIGH' : report.risk_score > 30 ? 'MODERATE' : 'LOW'}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Account Age</span>
              <span className="font-bold text-white">
                {report.account_age_days ? `${report.account_age_days}d` : 'Unknown'}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">OpenCV Faces</span>
              <span className="font-bold text-cyan-400">
                {report.face_analysis?.face_count || 0} Found
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Flags Triggered</span>
              <span className="font-bold text-amber-400">
                {(report.reasons || []).filter((r) => r.severity === 'critical' || r.severity === 'warning').length} Flags
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* OpenCV Computer Vision Facial Analysis Card */}
      <FaceAnalysisCard
        faceData={report.face_analysis}
        defaultImage={report.profile_image_preview}
      />

      {/* Recharts Visual Charts Section (Radar + Bar Benchmark) */}
      <ChartsSection metrics={report.metrics_breakdown} />

      {/* Explainable AI Signals & Reasons Breakdown */}
      <ReasonsBreakdown reasons={report.reasons} />

      {/* Actionable Security Recommendations */}
      <RecommendationsCard
        recommendations={report.recommendations}
        classification={report.classification}
      />

    </div>
  );
}
