import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ReasonsBreakdown({ reasons }) {
  const [filter, setFilter] = useState('all');

  if (!reasons || reasons.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No specific risk anomalies flagged.
      </div>
    );
  }

  const filteredReasons = reasons.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'negative') return r.severity === 'critical' || r.severity === 'warning';
    if (filter === 'positive') return r.severity === 'positive';
    return true;
  });

  const getSeverityBadge = (severity, impact) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          border: 'border-rose-900/60 bg-rose-950/30',
          badge: 'bg-rose-950 text-rose-300 border-rose-800',
          impactBadge: 'bg-rose-900/60 text-rose-300',
          impactSign: `+${impact}`
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          border: 'border-amber-900/60 bg-amber-950/20',
          badge: 'bg-amber-950 text-amber-300 border-amber-800',
          impactBadge: 'bg-amber-900/60 text-amber-300',
          impactSign: `+${impact}`
        };
      case 'positive':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
          border: 'border-emerald-900/60 bg-emerald-950/20',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          impactBadge: 'bg-emerald-900/60 text-emerald-300',
          impactSign: `${impact}`
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
          border: 'border-slate-800 bg-slate-900/40',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          impactBadge: 'bg-slate-800 text-slate-300',
          impactSign: `${impact > 0 ? '+' : ''}${impact}`
        };
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
      
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Explainable AI Risk Factors & Signals</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({reasons.length} signals detected)
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Algorithmic attribution breakdown with individual risk point deltas
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'all' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({reasons.length})
          </button>
          <button
            onClick={() => setFilter('negative')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'negative' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Risk Flags ({reasons.filter((r) => r.severity === 'critical' || r.severity === 'warning').length})
          </button>
          <button
            onClick={() => setFilter('positive')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'positive' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trust Marks ({reasons.filter((r) => r.severity === 'positive').length})
          </button>
        </div>
      </div>

      {/* List of Reasons */}
      <div className="space-y-3">
        {filteredReasons.map((reason, idx) => {
          const meta = getSeverityBadge(reason.severity, reason.impact);

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${meta.border} hover:scale-[1.005]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{meta.icon}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {reason.title}
                      </h4>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.2 rounded border ${meta.badge}`}>
                        {reason.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>

                {/* Score Delta Badge */}
                <div className="shrink-0 text-right">
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-mono font-bold ${meta.impactBadge}`}>
                    {reason.impact > 0 ? (
                      <ArrowUpRight className="w-3 h-3 text-rose-400" />
                    ) : reason.impact < 0 ? (
                      <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                    ) : null}
                    {meta.impactSign} pts
                  </span>
                  <div className="text-[10px] text-slate-500 uppercase mt-0.5 font-mono">
                    {reason.impact > 0 ? 'Risk added' : 'Trust bonus'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
