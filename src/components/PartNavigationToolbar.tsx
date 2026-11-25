import React from 'react';
import { ChevronLeft, ChevronRight, ListFilter, Layers, Search } from 'lucide-react';
import { TeardownPart } from '../types/teardown';

interface PartNavigationToolbarProps {
  parts: TeardownPart[];
  currentPartIndex: number;
  onSelectPart: (index: number) => void;
  onOpenRegistryModal: () => void;
}

export const PartNavigationToolbar: React.FC<PartNavigationToolbarProps> = ({
  parts,
  currentPartIndex,
  onSelectPart,
  onOpenRegistryModal,
}) => {
  const currentPart = parts[currentPartIndex];
  const total = parts.length;

  return (
    <div className="bg-[#0b1620]/90 dark:bg-[#08121a]/90 backdrop-blur-md border-b border-teal-900/40 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
      {/* Left: 17 Pages Stepper navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[#071017] border border-teal-900/60 rounded-lg p-0.5">
          <button
            onClick={() => onSelectPart(Math.max(0, currentPartIndex - 1))}
            disabled={currentPartIndex === 0}
            title="Previous Page (ArrowLeft)"
            className="p-1.5 text-teal-300 hover:text-cyan-200 hover:bg-teal-900/40 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 py-1 text-xs font-mono font-medium text-cyan-300 whitespace-nowrap">
            Page <span className="font-bold text-white">{currentPartIndex + 1}</span> of {total}
          </span>

          <button
            onClick={() => onSelectPart(Math.min(total - 1, currentPartIndex + 1))}
            disabled={currentPartIndex === total - 1}
            title="Next Page (ArrowRight)"
            className="p-1.5 text-teal-300 hover:text-cyan-200 hover:bg-teal-900/40 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown Selector for all 17 parts */}
        <div className="relative">
          <select
            value={currentPartIndex}
            onChange={(e) => onSelectPart(Number(e.target.value))}
            className="bg-[#071017] border border-teal-900/60 text-cyan-100 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none max-w-[220px] sm:max-w-[320px] truncate"
          >
            {parts.map((part, idx) => (
              <option key={part.id} value={idx} className="bg-[#0c1822] text-slate-200">
                {idx + 1}. {part.name} ({part.partNo})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-teal-400">
            <span className="text-[10px]">▼</span>
          </div>
        </div>
      </div>

      {/* Center / Right: Interactive Quick Jump Number Badges 1..17 */}
      <div className="hidden xl:flex items-center gap-1">
        {parts.map((p, idx) => {
          const isActive = idx === currentPartIndex;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPart(idx)}
              title={`${idx + 1}. ${p.name}`}
              className={`w-6 h-6 rounded text-[11px] font-mono transition-all ${
                isActive
                  ? 'bg-cyan-500 text-[#050c12] font-bold shadow-sm shadow-cyan-500/50 scale-105'
                  : 'text-teal-400/80 hover:text-cyan-200 hover:bg-teal-900/30'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Right: Overview button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenRegistryModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-teal-950/70 hover:bg-teal-900/70 border border-teal-700/50 rounded-lg transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All 17 Registry Parts</span>
        </button>
      </div>
    </div>
  );
};
