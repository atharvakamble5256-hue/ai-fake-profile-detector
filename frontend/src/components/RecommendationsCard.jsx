import React from 'react';
import { ShieldCheck, AlertOctagon, HelpCircle, CheckSquare, ExternalLink } from 'lucide-react';

export default function RecommendationsCard({ recommendations = [], classification = 'Genuine' }) {
  if (!recommendations || recommendations.length === 0) return null;

  const getHeader = () => {
    switch (classification) {
      case 'Likely Fake':
        return {
          icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
          title: 'Critical Threat Mitigation Recommendations',
          subtitle: 'Immediate safety measures to prevent phishing or credential theft'
        };
      case 'Suspicious':
        return {
          icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
          title: 'Cautionary Verification Protocols',
          subtitle: 'Recommended steps to validate authenticity before interacting'
        };
      case 'Genuine':
      default:
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          title: 'Account Verification Confirmation',
          subtitle: 'Standard organic interaction protocols'
        };
    }
  };

  const header = getHeader();

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
          {header.icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{header.title}</h3>
          <p className="text-xs text-slate-400">{header.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
          >
            <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{rec.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
