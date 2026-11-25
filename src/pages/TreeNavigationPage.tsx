import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { ChevronRight, ChevronDown, Folder, File, Layers, Cpu, ArrowLeft } from 'lucide-react';

interface TreeNavigationPageProps {
  onNavigate: (page: PageId) => void;
}

export const TreeNavigationPage: React.FC<TreeNavigationPageProps> = ({ onNavigate }) => {
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({
    vehicle: true,
    suspension: true,
    damper: true,
    shock: true,
  });

  const toggle = (node: string) => {
    setOpenNodes((prev) => ({ ...prev, [node]: !prev[node] }));
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Navigation Architecture · Screen 18
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Tree Navigation (Left Panel Architecture)
          </h1>
        </div>

        <button
          onClick={() => onNavigate(4)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-8 shadow-xl font-mono text-xs">
        <div className="space-y-2">
          {/* Level 0: Vehicle Aggregates */}
          <div className="flex items-center gap-2 text-white font-bold cursor-pointer" onClick={() => toggle('vehicle')}>
            {openNodes.vehicle ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-cyan-300">Ford Endeavour (2022) / Titanium 2026</span>
          </div>

          {openNodes.vehicle && (
            <div className="pl-6 space-y-2 border-l border-teal-900/60 ml-2">
              <div className="flex items-center gap-2 text-slate-300 hover:text-cyan-200 cursor-pointer" onClick={() => onNavigate(7)}>
                <span className="text-teal-500">├──</span>
                <span>Vehicle Aggregates (12 Systems)</span>
              </div>

              {/* Rear Suspension */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-200 font-semibold cursor-pointer" onClick={() => toggle('suspension')}>
                  <span className="text-teal-500">├──</span>
                  {openNodes.suspension ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span>Rear Suspension (7 Subsystems)</span>
                </div>

                {openNodes.suspension && (
                  <div className="pl-8 space-y-2 border-l border-teal-900/40 ml-4">
                    <div className="text-slate-400 hover:text-white cursor-pointer" onClick={() => onNavigate(9)}>
                      <span className="text-teal-600">├──</span> Spring System (8 Components)
                    </div>

                    {/* Damper System */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold cursor-pointer" onClick={() => toggle('damper')}>
                        <span className="text-teal-600">├──</span>
                        {openNodes.damper ? <ChevronDown className="w-3 h-3 text-cyan-400" /> : <ChevronRight className="w-3 h-3" />}
                        <span>Damper System (18 Components)</span>
                      </div>

                      {openNodes.damper && (
                        <div className="pl-8 space-y-1.5 border-l border-teal-900/30 ml-4">
                          {/* Shock Absorber */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-white font-bold cursor-pointer" onClick={() => toggle('shock')}>
                              <span className="text-teal-700">├──</span>
                              {openNodes.shock ? <ChevronDown className="w-3 h-3 text-cyan-400" /> : <ChevronRight className="w-3 h-3" />}
                              <span className="text-cyan-400">Shock Absorber (RS-DS-001)</span>
                            </div>

                            {openNodes.shock && (
                              <div className="pl-8 space-y-1 border-l border-teal-900/20 ml-4 text-slate-300">
                                <div onClick={() => onNavigate(11)} className="hover:text-cyan-300 cursor-pointer">
                                  <span className="text-teal-700">├──</span> Overview &amp; Specifications (Page 11)
                                </div>
                                <div onClick={() => onNavigate(12)} className="hover:text-cyan-300 cursor-pointer">
                                  <span className="text-teal-700">├──</span> Internal Parts Breakdown (Page 12)
                                </div>
                                <div onClick={() => onNavigate(13)} className="hover:text-cyan-300 cursor-pointer">
                                  <span className="text-teal-700">├──</span> Communications &amp; Logs (Page 13)
                                </div>
                                <div onClick={() => onNavigate(15)} className="hover:text-cyan-300 cursor-pointer">
                                  <span className="text-teal-700">├──</span> Lifecycle Documents: RFI, RFQ, DV, PV, PP, SOP, Warranty (Page 15)
                                </div>
                              </div>
                            )}
                          </div>

                          <div onClick={() => onNavigate(10)} className="text-slate-400 hover:text-white cursor-pointer">
                            <span className="text-teal-700">├──</span> Piston Rod (RS-DS-002)
                          </div>
                          <div onClick={() => onNavigate(10)} className="text-slate-400 hover:text-white cursor-pointer">
                            <span className="text-teal-700">├──</span> Piston Assembly (RS-DS-003)
                          </div>
                          <div onClick={() => onNavigate(10)} className="text-slate-400 hover:text-white cursor-pointer">
                            <span className="text-teal-700">└──</span> Cylinder Tube (RS-DS-004)
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-slate-400 hover:text-white cursor-pointer" onClick={() => onNavigate(9)}>
                      <span className="text-teal-600">├──</span> Control Arm System (10 Components)
                    </div>
                    <div className="text-slate-400 hover:text-white cursor-pointer" onClick={() => onNavigate(9)}>
                      <span className="text-teal-600">├──</span> Stabilizer System (9 Components)
                    </div>
                    <div className="text-slate-400 hover:text-white cursor-pointer" onClick={() => onNavigate(9)}>
                      <span className="text-teal-600">├──</span> Knuckle &amp; Hub System (10 Components)
                    </div>
                    <div className="text-slate-400 hover:text-white cursor-pointer" onClick={() => onNavigate(9)}>
                      <span className="text-teal-600">├──</span> Bushing &amp; Joint System (8 Components)
                    </div>
                    <div className="text-slate-400 hover:text-white cursor-pointer" onClick={() => onNavigate(9)}>
                      <span className="text-teal-600">└──</span> Mounting System (6 Components)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
