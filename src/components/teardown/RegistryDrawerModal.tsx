import React, { useState } from 'react';
import { TeardownPart } from '../../types/teardown';
import { X, Search, Layers, ChevronRight, CheckCircle2, TrendingDown } from 'lucide-react';

interface RegistryDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: TeardownPart[];
  currentPartIndex: number;
  onSelectPart: (index: number) => void;
}

export const RegistryDrawerModal: React.FC<RegistryDrawerModalProps> = ({
  isOpen,
  onClose,
  parts,
  currentPartIndex,
  onSelectPart,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partNo.toLowerCase().includes(search.toLowerCase()) ||
      p.material.toLowerCase().includes(search.toLowerCase())
  );

  const totalCostINR = parts.reduce((acc, p) => acc + (p.probableCostINR || 0), 0);
  const totalWeightKg = parts.reduce((acc, p) => acc + (p.weightKg || 0), 0);
  const totalIdeas = parts.reduce((acc, p) => acc + (p.ideas?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end">
      <div className="w-full max-w-2xl h-full bg-[#07131e] border-l border-teal-800/60 p-6 flex flex-col justify-between shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="border-b border-teal-900/50 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-700/60 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  17-Part Teardown Registry
                </h2>
                <div className="text-[11px] text-teal-400 font-mono">
                  Ford Titanium 2026 · Cylinder Block Assembly
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0a1824] border border-teal-800/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Assembly Metric Summary */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-2.5 bg-[#050e17] rounded-xl border border-teal-950">
              <span className="text-[10px] text-teal-400 uppercase">Total Unit Cost</span>
              <span className="font-bold text-emerald-400 block mt-0.5">₹{totalCostINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2.5 bg-[#050e17] rounded-xl border border-teal-950">
              <span className="text-[10px] text-teal-400 uppercase">Total Assembly Mass</span>
              <span className="font-bold text-cyan-300 block mt-0.5">{totalWeightKg.toFixed(2)} kg</span>
            </div>
            <div className="p-2.5 bg-[#050e17] rounded-xl border border-teal-950">
              <span className="text-[10px] text-teal-400 uppercase">VAVE Proposals</span>
              <span className="font-bold text-amber-300 block mt-0.5">{totalIdeas} Ideas</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part name, part no, or material..."
              className="w-full bg-[#050e17] border border-teal-900 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* 17 Parts Scrollable List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
          {filtered.map((p, idx) => {
            const actualIndex = parts.findIndex((item) => item.id === p.id);
            const isSelected = actualIndex === currentPartIndex;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPart(actualIndex);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#092233] to-[#071824] border-cyan-400/80 ring-1 ring-cyan-500/30'
                    : 'bg-[#081521]/80 hover:bg-[#0c1e2e] border-teal-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cyan-400 text-[#040e17]' : 'bg-[#050e17] text-teal-400 border border-teal-950'
                  }`}>
                    {p.id}
                  </span>

                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-teal-400/80 font-mono mt-0.5">
                      {p.partNo} · ₹{p.probableCostINR} · {p.weightKg} kg
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {p.ideas.length > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-cyan-300 border border-teal-800/40">
                      {p.ideas.length} VAVE
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-teal-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-teal-900/50 flex items-center justify-between text-xs text-slate-400">
          <span>All 17 teardown specifications loaded</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-950 hover:bg-teal-900 text-cyan-300 font-semibold rounded-lg border border-teal-700/60 transition-colors"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
