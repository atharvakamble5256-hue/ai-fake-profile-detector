import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { Radar as RadarIcon, BarChart3 } from 'lucide-react';

export default function ChartsSection({ metrics }) {
  if (!metrics) return null;

  // Format data for Radar Chart
  const radarData = [
    { subject: 'Network Health', score: metrics.network_integrity, fullMark: 100 },
    { subject: 'Identity Auth', score: metrics.identity_authenticity, fullMark: 100 },
    { subject: 'Content Trust', score: metrics.content_credibility, fullMark: 100 },
    { subject: 'Behavior Rhythm', score: metrics.behavioral_rhythm, fullMark: 100 },
    { subject: 'Visual Quality', score: metrics.visual_quality, fullMark: 100 },
  ];

  // Format data for Comparative Benchmark Bar Chart
  const barData = [
    { name: 'Network', current: metrics.network_integrity, benchmark: 80 },
    { name: 'Identity', current: metrics.identity_authenticity, benchmark: 85 },
    { name: 'Content', current: metrics.content_credibility, benchmark: 78 },
    { name: 'Behavior', current: metrics.behavioral_rhythm, benchmark: 82 },
    { name: 'Visual', current: metrics.visual_quality, benchmark: 75 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
      
      {/* 1. Radar Chart: Multi-Factor Trust Geometry */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800">
              <RadarIcon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Trust Dimension Radar</h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            5 Axes Evaluation
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-2">
          Balanced polygon perimeter reflects authentic human profile behavior.
        </p>

        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar
                name="Profile Score"
                dataKey="score"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Bar Chart: Profile Metric vs Verified Baseline */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-950 text-blue-400 border border-blue-800">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Baseline Benchmark Comparison</h4>
          </div>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">
            Vs Organic Cohort
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-2">
          Metrics comparison against verified healthy accounts on same platform.
        </p>

        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              />
              <Bar
                dataKey="current"
                name="Evaluated Profile"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="benchmark"
                name="Verified Baseline"
                fill="#334155"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
