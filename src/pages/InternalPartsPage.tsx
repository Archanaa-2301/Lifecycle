import React, { useState } from 'react';
import { runSelectionFlight } from '../utils/selectionMotion';
import { PageId } from '../types/lifex';
import { ArrowLeft, ArrowRight, Layers, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

interface InternalPartsPageProps {
  onNavigate: (page: PageId) => void;
}

export const InternalPartsPage: React.FC<InternalPartsPageProps> = ({ onNavigate }) => {
  const [selectedPart, setSelectedPart] = useState<string>('Piston Assembly');
  const [partSelectionBusy, setPartSelectionBusy] = useState(false);
  const choosePart = (name: string, source: HTMLButtonElement) => {
    if (partSelectionBusy) return; setPartSelectionBusy(true);
    runSelectionFlight(source, { title: name, subtitle: 'INTERNAL PART SELECTED', targetElement: document.querySelector<HTMLElement>('.internal-part-dossier'), duration: 850, onComplete: () => { setSelectedPart(name); setPartSelectionBusy(false); } });
  };

  const parts = [
    {
      name: 'Upper Mount',
      y: '12%',
      material: 'Natural Rubber Isolator + Stamped Steel Flange',
      function: 'Isolates high-frequency road vibrations from entering the unibody chassis tower.',
      status: 'Nominal',
    },
    {
      name: 'Rod Guide',
      y: '22%',
      material: 'Sintered Iron with DU Bushing (PTFE Bronze)',
      function: 'Precisely centers and guides reciprocating chrome piston rod under side-load forces.',
      status: 'Nominal',
    },
    {
      name: 'Rod Seal',
      y: '30%',
      material: 'High-Temperature FKM Fluorocarbon Elastomer',
      function: 'Dual-lip high pressure oil and gas dynamic sealing preventing external fluid weeping.',
      status: 'Nominal',
    },
    {
      name: 'Piston Assembly',
      y: '42%',
      material: 'Sintered Powder Metal + Glass-Filled PTFE Band',
      function: 'Houses multi-stage deflective shim valves controlling dynamic rebound damping forces.',
      status: 'Root Cause Focal Point',
      highlight: true,
    },
    {
      name: 'Inner Cylinder',
      y: '54%',
      material: 'ST52-3 Roller Burnished Steel Tube (Ra 0.12µm)',
      function: 'Precision pressure chamber accommodating linear travel of the damping piston.',
      status: 'Nominal',
    },
    {
      name: 'Reservoir Tube',
      y: '65%',
      material: 'Cold Drawn Welded Steel Outer Tube with Powder Coat',
      function: 'Houses reserve fluid volume and low-pressure nitrogen gas cushion cushion.',
      status: 'Nominal',
    },
    {
      name: 'Base Valve',
      y: '76%',
      material: 'Case Hardened Steel Disc Stack with Cast Iron Body',
      function: 'Regulates compression stroke fluid exchange between working cylinder and reservoir.',
      status: 'Nominal',
    },
    {
      name: 'HVAC / Valve Disc',
      y: '84%',
      material: '65Mn Spring Steel (Case Nitrided)',
      function: 'Deflective pre-load disk regulating low-velocity ride plushness.',
      status: 'Wear Inspected',
    },
    {
      name: 'Lower Mount',
      y: '92%',
      material: 'Ductile Cast Iron Eyelet with Vulcanized Silentbloc',
      function: 'Connects damper bottom securely to lower control arm / rear knuckle assembly.',
      status: 'Nominal',
    },
  ];

  const active = parts.find((p) => p.name === selectedPart) || parts[3];

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(11)}
            className="p-2 rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Shock Absorber (RS-DS-001)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
              Internal Parts Breakdown
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigate(13)}
          className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
        >
          <span>View Communications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Diagram & Inspection Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cutaway CAD Column */}
        <div className="lg:col-span-7 bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 relative overflow-hidden shadow-2xl min-h-[580px] flex items-center justify-center">
          {/* Blueprint background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />

          {/* Central Cutaway Diagram */}
          <div className="relative w-full max-w-md h-[500px] flex items-center justify-center">
            {/* Shock Absorber Illustration */}
            <div className="w-24 h-[440px] rounded-full border-2 border-cyan-500/50 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-cyan-500/20 relative flex flex-col items-center justify-between p-2">
              <div className="w-12 h-10 rounded-full border border-teal-400 bg-teal-950/80" />
              <div className="w-6 h-28 bg-slate-300 rounded-sm" />
              <div className="w-16 h-8 rounded bg-cyan-600 border border-cyan-300 animate-pulse" />
              <div className="w-20 h-44 border border-teal-500/60 rounded-lg bg-[#0c1e2b]/80" />
              <div className="w-12 h-10 rounded-full border border-teal-400 bg-teal-950/80" />
            </div>

            {/* Part Pins / Callouts */}
            {parts.map((p) => {
              const isSelected = p.name === selectedPart;
              return (
                <button
                  key={p.name}
                  onClick={(event) => choosePart(p.name, event.currentTarget)} disabled={partSelectionBusy}
                  style={{ top: p.y }}
                  className={`absolute right-0 sm:right-6 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-cyan-500 text-[#040d16] font-bold scale-110 ring-4 ring-cyan-500/30'
                      : p.highlight
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/70 hover:scale-105'
                      : 'bg-[#081724]/90 text-slate-200 border border-teal-800/80 hover:border-cyan-400 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#040d16]' : 'bg-cyan-400'}`} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Part Diagnostic Dossier */}
        <div className="internal-part-dossier lg:col-span-5 bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-teal-900/40 pb-3">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Teardown Sub-Component
            </span>
            <h2 className="text-xl font-bold text-white mt-1">{active.name}</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Material Specification
              </div>
              <div className="p-3 bg-[#050e17] rounded-xl border border-teal-950 text-white font-mono">
                {active.material}
              </div>
            </div>

            <div>
              <div className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Primary Function
              </div>
              <p className="p-3 bg-[#050e17] rounded-xl border border-teal-950 text-slate-300 leading-relaxed">
                {active.function}
              </p>
            </div>

            <div>
              <div className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Teardown Wear Status
              </div>
              <div className="p-3 bg-[#050e17] rounded-xl border border-teal-950 flex items-center justify-between">
                <span className="text-white font-semibold">{active.status}</span>
                {active.highlight ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-600/50">
                    Warning
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-600/50">
                    Passed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-teal-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-400">Next Step:</span>
            <button
              onClick={() => onNavigate(13)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <span>View Field Communications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
