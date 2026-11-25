import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { ZoomIn, ZoomOut, RotateCcw, Tag, ArrowRight, Layers, Eye, ChevronRight } from 'lucide-react';

interface RearSuspensionAssemblyPageProps {
  onNavigate: (page: PageId) => void;
}

export const RearSuspensionAssemblyPage: React.FC<RearSuspensionAssemblyPageProps> = ({
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'assembly' | 'exploded'>('exploded');
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Exact coordinates calibrated to the 3D Exploded Rear Suspension CAD image
  const labels = [
    { name: 'Upper Control Arm', x: '24%', y: '16%', page: 11 },
    { name: 'Rear Subframe', x: '46%', y: '12%', page: 11 },
    { name: 'Coil Spring', x: '62%', y: '14%', page: 11 },
    { name: 'Twin-Tube Shock Absorber', x: '78%', y: '18%', page: 11, focal: true },
    { name: 'Differential Assembly', x: '45%', y: '40%', page: 11 },
    { name: 'Axle Shaft', x: '64%', y: '50%', page: 11 },
    { name: 'Lower Control Arm', x: '36%', y: '68%', page: 11 },
    { name: 'Trailing Arm & Toe Link', x: '52%', y: '84%', page: 11 },
    { name: 'Wheel Hub & Rotor', x: '86%', y: '46%', page: 11 },
  ];

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            System Level 1 · Chassis Architecture · Screen 8
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Rear Suspension Assembly
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#07131e] border border-teal-800/60 rounded-xl p-1">
            <button
              onClick={() => setViewMode('assembly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'assembly'
                  ? 'bg-cyan-500 text-[#040e17] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Assembly View
            </button>
            <button
              onClick={() => setViewMode('exploded')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'exploded'
                  ? 'bg-cyan-500 text-[#040e17] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Exploded View
            </button>
          </div>

          <button
            onClick={() => onNavigate(9)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
          >
            <span>Explore by Subsystem</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D CAD Stage */}
      <div className="max-w-7xl mx-auto bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between">
        {/* Background blueprint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c233315_1px,transparent_1px),linear-gradient(to_bottom,#0c233315_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Top-Right HUD Stats Overlay matching panel 8 */}
        <div className="absolute right-6 sm:right-8 top-6 sm:top-8 z-20 bg-[#06121c]/95 border border-teal-800/80 rounded-xl p-3 sm:p-4 text-right space-y-1 backdrop-blur-md shadow-lg">
          <div className="text-xs text-slate-300">
            <span className="font-mono text-cyan-300 font-bold text-sm sm:text-base">7</span> Subsystems
          </div>
          <div className="text-xs text-slate-300">
            <span className="font-mono text-cyan-300 font-bold text-sm sm:text-base">56</span> Components
          </div>
          <div className="text-xs text-slate-300">
            <span className="font-mono text-cyan-300 font-bold text-sm sm:text-base">120+</span> Internal Parts
          </div>
        </div>

        {/* CAD Assembly Visual Centerpiece with real local generated image */}
        <div className="relative w-full max-w-5xl mx-auto h-[400px] sm:h-[480px] flex items-center justify-center my-2 overflow-hidden rounded-xl bg-[#050e17]">
          <img
            src="/rear-suspension-innova-assembly.png"
            alt="Rear Suspension 3D CAD Exploded Model"
            style={{ transform: `scale(${zoomLevel})` }}
            className="w-full h-full object-contain filter contrast-125 brightness-105 transition-transform duration-300 rounded-xl"
          />

          {/* Interactive exploded callouts mapped directly onto components */}
          {showLabels &&
            labels.map((lbl, i) => (
              <button
                key={i}
                onClick={() => onNavigate(11)}
                style={{ left: lbl.x, top: lbl.y }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-xl flex items-center gap-1.5 z-20 backdrop-blur-sm ${
                  lbl.focal
                    ? 'bg-cyan-400 text-[#040e17] font-bold ring-4 ring-cyan-400/40 scale-105 shadow-cyan-400/50'
                    : 'bg-[#061522]/90 text-cyan-100 border border-teal-600/70 hover:border-cyan-400 hover:text-white hover:scale-105'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${lbl.focal ? 'bg-[#040e17]' : 'bg-cyan-400'}`} />
                <span>{lbl.name}</span>
                {lbl.focal && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ))}
        </div>

        {/* Bottom Floating Viewer Toolbar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-teal-900/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-2 rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white hover:bg-[#0c2234] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-2 rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white hover:bg-[#0c2234] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081521] border border-teal-800/60 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0c2234] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                showLabels
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                  : 'bg-[#081521] text-slate-400 border-teal-800/60'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Show Labels</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate(9)}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-[#041019] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Explore by Subsystem (Page 9)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
