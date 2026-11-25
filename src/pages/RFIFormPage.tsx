import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { ArrowLeft, ArrowRight, Save, Sparkles, Check, FileCheck } from 'lucide-react';

interface RFIFormPageProps {
  onNavigate: (page: PageId) => void;
}

export const RFIFormPage: React.FC<RFIFormPageProps> = ({ onNavigate }) => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    rfiNumber: 'RFI-2024-001',
    customer: 'Ford Motor Company',
    vehicleProgram: 'Ford Endeavour (2022) / Titanium 2026',
    component: 'Shock Absorber (RS-DS-001)',
    dateReceived: '12/10/2024',
    responseDue: '26/10/2024',
    rfiDescription:
      'Noise from rear shock absorber on rough roads. Teardown investigation confirmed valve disc micro-wear caused by hydraulic oil contamination from tube cut-off station. Corrective action: 5-micron ultrasonic washing station installed at sub-tier and valve disc upgraded to case-nitrided 65Mn spring steel.',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(15)}
            className="p-2 rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span>Lifecycle Document</span>
              <span>·</span>
              <span>Stage 1: Inquiry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
              RFI — Request for Information
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigate(17)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
        >
          <span>View Final Engineering Report (Page 17)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main RFI Form Card */}
      <div className="max-w-5xl mx-auto bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-teal-900/40 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Engineering Request Record</h2>
            <p className="text-xs text-slate-400">Formal response artifact filed with OEM quality engineering.</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Communication Extracted</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              RFI Number
            </label>
            <input
              type="text"
              value={form.rfiNumber}
              onChange={(e) => setForm({ ...form, rfiNumber: e.target.value })}
              className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              Customer / OEM
            </label>
            <input
              type="text"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              Vehicle Program
            </label>
            <input
              type="text"
              value={form.vehicleProgram}
              onChange={(e) => setForm({ ...form, vehicleProgram: e.target.value })}
              className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              Component
            </label>
            <input
              type="text"
              value={form.component}
              onChange={(e) => setForm({ ...form, component: e.target.value })}
              className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              Date Received
            </label>
            <input
              type="text"
              value={form.dateReceived}
              onChange={(e) => setForm({ ...form, dateReceived: e.target.value })}
              className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
              Response Due
            </label>
            <input
              type="text"
              value={form.responseDue}
              onChange={(e) => setForm({ ...form, responseDue: e.target.value })}
              className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-1">
            RFI Description &amp; Engineering Synthesis
          </label>
          <textarea
            rows={4}
            value={form.rfiDescription}
            onChange={(e) => setForm({ ...form, rfiDescription: e.target.value })}
            className="w-full bg-[#050e17] border border-teal-900/80 rounded-xl p-4 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-teal-900/40 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {saved ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4" /> Record saved to lifecycle database!
              </span>
            ) : (
              'Auto-saved locally with timestamp.'
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#081724] hover:bg-[#0c2234] border border-teal-700/60 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-teal-950 hover:bg-teal-900 border border-teal-600/70 text-xs font-bold text-cyan-300 transition-colors cursor-pointer"
            >
              Save Record
            </button>
            <button
              onClick={() => onNavigate(17)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-cyan-500/25 cursor-pointer"
            >
              <span>Generate Report</span>
              <FileCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
