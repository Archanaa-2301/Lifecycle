import React from 'react';
import { PageId } from '../types/lifex';
import { ArrowLeft, ArrowRight, Eye, Layers } from 'lucide-react';

interface BandViewPageProps {
  onNavigate: (page: PageId) => void;
}

export const BandViewPage: React.FC<BandViewPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            3D Volumetric Spatial Band · Screen 19
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            BandView · Chassis Spatial Envelope
          </h1>
        </div>

        <button
          onClick={() => onNavigate(8)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assembly</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between">
        <div className="relative w-full h-[360px] flex items-center justify-center">
          <img
            src="/src/assets/images/vehicle_3d_wireframe_chassis_1793338595923.jpg"
            alt="BandView Holographic Wireframe"
            className="w-full h-full object-contain filter contrast-125 brightness-105 rounded-xl"
          />

          {/* Highlighted glowing spatial band */}
          <div className="absolute right-12 sm:right-28 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full border-2 border-cyan-400/80 bg-cyan-500/10 backdrop-blur-[2px] animate-pulse flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)]">
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 text-xs font-bold">
              Rear Suspension Band
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-teal-900/40 text-xs">
          <div className="text-slate-400">
            Enclosed: <span className="font-bold text-cyan-300">7 Subsystems · 56 Components · 120+ Parts</span>
          </div>

          <button
            onClick={() => onNavigate(8)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>Open Exploded View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
