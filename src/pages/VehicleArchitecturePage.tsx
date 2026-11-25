import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { ArrowRight, ChevronRight, Layers, Eye, CheckCircle2 } from 'lucide-react';

interface VehicleArchitecturePageProps {
  onNavigate: (page: PageId) => void;
}

export const VehicleArchitecturePage: React.FC<VehicleArchitecturePageProps> = ({ onNavigate }) => {
  const [hoveredSystem, setHoveredSystem] = useState<string>('Rear Suspension');

  // Systems calibrated to the 3D isometric SUV wireframe CAD geometry
  const systems = [
    { name: 'Body & Chassis', top: '16%', left: '32%', page: 7 },
    { name: 'Electrical', top: '22%', left: '72%', page: 7 },
    { name: 'Interior', top: '34%', left: '52%', page: 7 },
    { name: 'Transmission', top: '48%', left: '60%', page: 7 },
    { name: 'Steering', top: '38%', left: '78%', page: 7 },
    { name: 'Front Suspension', top: '56%', left: '76%', page: 7 },
    { name: 'Braking', top: '78%', left: '72%', page: 7 },
    { name: 'Battery', top: '68%', left: '55%', page: 7 },
    { name: 'Safety', top: '45%', left: '38%', page: 7 },
    // Glowing focal hotspot pointing directly to the rear axle / damper assembly
    { name: 'Rear Suspension', top: '68%', left: '34%', page: 8, active: true },
  ];

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Vehicle Architecture Explorer · Screen 7
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Ford Endeavour (2022) / Titanium 2026 Architecture
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(6)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white transition-colors"
          >
            ← Configuration
          </button>
          <button
            onClick={() => onNavigate(8)}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
          >
            <span>Rear Suspension Assembly</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D CAD Blueprint Wireframe Canvas */}
      <div className="max-w-7xl mx-auto bg-[#06111a]/95 border border-teal-900/60 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between">
        {/* Background CAD grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#08203020_1px,transparent_1px),linear-gradient(to_bottom,#08203020_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* 3D Wireframe CAD Blueprint Visual representation */}
        <div className="relative w-full max-w-5xl mx-auto h-[400px] sm:h-[460px] flex items-center justify-center my-2">
          <img
            src="/src/assets/images/vehicle_3d_wireframe_chassis_1793338595923.jpg"
            alt="3D CAD Blueprint Wireframe"
            className="w-full h-full object-contain filter contrast-125 brightness-105 rounded-xl shadow-2xl"
          />

          {/* Interactive architectural callout nodes */}
          {systems.map((sys) => {
            const isFocal = sys.active;
            return (
              <button
                key={sys.name}
                onClick={() => onNavigate(sys.page as PageId)}
                onMouseEnter={() => setHoveredSystem(sys.name)}
                style={{ top: sys.top, left: sys.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xl flex items-center gap-2 whitespace-nowrap z-20 ${
                  isFocal
                    ? 'bg-cyan-400 text-[#030d15] font-bold ring-4 ring-cyan-400/40 scale-110 shadow-cyan-400/50'
                    : 'bg-[#061421]/95 text-cyan-100 border border-teal-700/80 hover:border-cyan-400 hover:text-white hover:scale-105 backdrop-blur-sm'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isFocal ? 'bg-[#030d15] animate-ping' : 'bg-cyan-400'}`} />
                <span>{sys.name}</span>
                {isFocal && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation & Indicator bar matching panel 7 */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-teal-900/50 text-xs">
          <div className="text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">System Selected:</span>
            <span className="font-bold text-cyan-300 font-mono text-sm">{hoveredSystem}</span>
            <span className="text-teal-500/70">·</span>
            <span className="text-teal-400">Click on any node above or &quot;Rear Suspension&quot; to inspect architecture.</span>
          </div>

          <button
            onClick={() => onNavigate(8)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-[#040e17] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Rear Suspension (Page 8)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
