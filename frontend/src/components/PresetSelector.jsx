import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Sparkles, UserCheck, Bot, Ghost, ShieldAlert } from 'lucide-react';

export default function PresetSelector({ presets, onSelectPreset, selectedPresetId }) {
  if (!presets || presets.length === 0) return null;

  const getCategoryMeta = (category) => {
    switch (category) {
      case 'Likely Fake':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
          badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
          borderClass: 'hover:border-rose-500/50',
          indicator: 'bg-rose-500'
        };
      case 'Suspicious':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
          borderClass: 'hover:border-amber-500/50',
          indicator: 'bg-amber-500'
        };
      case 'Genuine':
      default:
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
          borderClass: 'hover:border-emerald-500/50',
          indicator: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-8 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Judge Quick-Test Profiles
            </h3>
            <p className="text-xs text-slate-400">
              Click any scenario to instantly populate profile data and test the AI detection engine
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-800/50 self-start sm:self-auto">
          {presets.length} Presets Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {presets.map((preset) => {
          const meta = getCategoryMeta(preset.category);
          const isSelected = selectedPresetId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : 'bg-slate-950/50 border-slate-800 ' + meta.borderClass + ' hover:bg-slate-800/50'
              }`}
            >
              {/* Category Badge & Platform */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${meta.badgeClass}`}>
                  {meta.icon}
                  {preset.category}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  {preset.data.platform}
                </span>
              </div>

              {/* Title & Handle */}
              <div className="mb-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {preset.label}
                </h4>
                <p className="text-[11px] font-mono text-cyan-400 truncate">
                  @{preset.data.username}
                </p>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {preset.description}
              </p>

              {/* Stats Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                <span>{preset.data.followers_count.toLocaleString()} followers</span>
                <span>{preset.data.following_count.toLocaleString()} following</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
