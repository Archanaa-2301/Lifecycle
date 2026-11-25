import React from 'react';
import { PageId, ComponentItem } from '../types/lifex';
import { DAMPER_COMPONENTS } from '../data/lifexData';
import { ArrowLeft, ChevronRight, Layers } from 'lucide-react';

interface DamperComponentsPageProps {
  onNavigate: (page: PageId) => void;
  onSelectComponent: (comp: ComponentItem) => void;
}

export const DamperComponentsPage: React.FC<DamperComponentsPageProps> = ({
  onNavigate,
  onSelectComponent,
}) => {
  const handleSelect = (comp: ComponentItem) => {
    onSelectComponent(comp);
    onNavigate(11); // Component Details
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header matching panel 10 */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span>Rear Suspension &gt; Damper System</span>
            <span>·</span>
            <span>4 System Components</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Damper System Components
          </h1>
        </div>

        <button
          onClick={() => onNavigate(9)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white transition-colors self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subsystems</span>
        </button>
      </div>

      {/* Components List matching panel 10 (with real 3D CAD images, NO weight, NO cost) */}
      <div className="max-w-6xl mx-auto space-y-4">
        {DAMPER_COMPONENTS.map((comp) => {
          const isShock = comp.id === 'RS-DS-001';
          return (
            <div
              key={comp.id}
              onClick={() => handleSelect(comp)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-5 group shadow-lg ${
                isShock
                  ? 'bg-gradient-to-r from-[#082030] via-[#071622] to-[#050f18] border-cyan-400/80 ring-2 ring-cyan-500/20'
                  : 'bg-[#07131e]/90 hover:bg-[#0b1d2c] border-teal-900/60 hover:border-teal-700'
              }`}
            >
              {/* Left Side: Real 3D CAD Image + Name + ID */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                {/* 3D CAD Thumbnail container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#040d15] border border-teal-950 flex items-center justify-center p-2 shrink-0 group-hover:border-cyan-500/40 transition-colors shadow-inner overflow-hidden">
                  {comp.image ? (
                    <img
                      src={comp.image}
                      alt={comp.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Layers className="w-8 h-8 text-cyan-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {comp.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 font-semibold mt-1">
                    ID: {comp.id}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1 hidden sm:block">
                    {comp.supplier} · {comp.material}
                  </div>
                </div>
              </div>

              {/* Right Side: Clean chevron affordance (weight and cost removed as requested) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-teal-800/80 group-hover:border-cyan-400 text-teal-300 group-hover:text-cyan-200 flex items-center justify-center group-hover:translate-x-1 transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
