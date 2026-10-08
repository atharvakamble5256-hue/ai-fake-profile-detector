import React from 'react';
import { Camera, CheckCircle2, AlertTriangle, Eye, Sparkles, Terminal } from 'lucide-react';

export default function FaceAnalysisCard({ faceData, defaultImage }) {
  if (!faceData) return null;

  const displayImage = faceData.annotated_image || defaultImage;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">OpenCV Computer Vision Analysis</h3>
            <p className="text-xs text-slate-400">Haar Cascade facial detection, liveness heuristics & sharpness</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
          faceData.face_detected
            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
            : 'bg-amber-950/70 text-amber-300 border-amber-800'
        }`}>
          {faceData.face_detected ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          {faceData.face_count} Face(s) Detected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Left: Annotated OpenCV Image */}
        <div className="flex flex-col items-center justify-center bg-slate-950 p-3 rounded-xl border border-slate-800 relative">
          {displayImage ? (
            <div className="relative group rounded-lg overflow-hidden border border-cyan-500/30 max-h-56">
              <img
                src={displayImage}
                alt="Profile Analysis"
                className="w-full h-auto max-h-52 object-contain rounded-md"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-cyan-300 border border-cyan-800">
                OPENCV FEED
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
              <Camera className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[11px]">No Image Provided</span>
            </div>
          )}
          <span className="text-[11px] text-slate-500 font-mono mt-2">
            Haar Cascade FrontalFace V2
          </span>
        </div>

        {/* Middle: Biometric & Image Metrics */}
        <div className="space-y-2.5 text-xs">
          
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Laplacian Sharpness</span>
              <span className="font-mono font-bold text-white">{faceData.sharpness}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${faceData.is_blurry ? 'bg-rose-500' : 'bg-cyan-400'}`}
                style={{ width: `${Math.min(100, (faceData.sharpness / 200) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {faceData.is_blurry ? '⚠️ Motion blur or low resolution' : '✓ Clean pixel resolution'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Default Avatar Check</span>
              <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                faceData.is_default_avatar
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {faceData.is_default_avatar ? 'Placeholder / Generic' : 'Custom Image'}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">AI / GAN Synthesis Check</span>
              <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                faceData.is_stock_or_ai_suspect
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}>
                {faceData.is_stock_or_ai_suspect ? 'Potential GAN Profile' : 'Organic Geometry'}
              </span>
            </div>
          </div>

        </div>

        {/* Right: Computer Vision Telemetry Logs */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400 mb-2 pb-1 border-b border-slate-800">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-300">CV Pipeline Diagnostics</span>
          </div>

          <div className="space-y-1.5 text-slate-300 overflow-y-auto max-h-44 text-[11px] leading-relaxed">
            {faceData.cv_notes && faceData.cv_notes.length > 0 ? (
              faceData.cv_notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-500 font-bold">&gt;</span>
                  <span>{note}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-500">Pipeline ready. Awaiting image input.</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
