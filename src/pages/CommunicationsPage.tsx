import React, { useMemo, useState } from 'react';
import { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';
import { ArrowLeft, ArrowRight, Sparkles, User, ShieldAlert, ClipboardList } from 'lucide-react';

interface CommunicationsPageProps {
  componentIndex: number;
  onNavigate: (page: PageId) => void;
}

export const CommunicationsPage: React.FC<CommunicationsPageProps> = ({ componentIndex, onNavigate }) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];
  const threads = useMemo(() => [
    {
      id: 'customer', stage: 'Customer', date: 'Illustrative record', team: 'OEM / Application Engineering',
      title: `${part.name} — application requirement review`,
      preview: `Confirm the component function, package and vehicle interfaces: ${part.interfaces.slice(0, 2).join('; ')}.`,
      fullText: `The application team requests confirmation that the ${part.name.toLowerCase()} fulfils its intended role: ${part.purpose} The review should confirm the vehicle package, operating envelope and the interfaces listed for this component.`,
    },
    {
      id: 'engineering', stage: 'Engineering', date: 'Illustrative record', team: 'Suspension Product Engineering',
      title: `${part.name} — design review comments`,
      preview: part.engineering.slice(0, 2).join('; '),
      fullText: `Engineering review focus: ${part.engineering.join('; ')}. Operating context: ${part.operation} Confirm the released drawing and product specification before assigning numerical limits or tolerances.`,
    },
    {
      id: 'validation', stage: 'Validation', date: 'Illustrative record', team: 'Design Verification & Validation',
      title: `${part.name} — verification plan`,
      preview: part.checks.slice(0, 2).join('; '),
      fullText: `The validation team should build a component-level verification plan around the following checks: ${part.checks.join('; ')}. Test levels, sample sizes and acceptance limits must be taken from the approved vehicle-program specification.`,
    },
    {
      id: 'supplier', stage: 'Supplier', date: 'Illustrative record', team: 'Supplier Quality / Manufacturing Engineering',
      title: `${part.name} — supplier evidence request`,
      preview: `Request material, process, dimensional and traceability evidence relevant to ${part.name.toLowerCase()}.`,
      fullText: `Request the supplier's applicable material and process declarations, dimensional inspection results, process controls and traceability evidence for the ${part.name.toLowerCase()}. Evidence must match the released part revision and approved sourcing route.`,
    },
    {
      id: 'closure', stage: 'Engineering', date: 'Illustrative record', team: 'Component Design Owner',
      title: `${part.name} — design release readiness`,
      preview: `Close open interface, design and validation actions before component release.`,
      fullText: `Release readiness for ${part.name} depends on closure of the identified design considerations, confirmation of its interfaces (${part.interfaces.join('; ')}) and completion of the verification checks (${part.checks.join('; ')}). This is a workflow example, not a record of an actual approval.`,
    },
  ], [part]);

  const [selectedThreadId, setSelectedThreadId] = useState('customer');
  const selectedThread = threads.find((thread) => thread.id === selectedThreadId) || threads[0];

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6 lifex-page-enter">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(11)} className="p-2 rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white" aria-label="Back to component library"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Page 13 · Component Communications</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">Communications · {part.name}</h1>
            <p className="text-xs text-teal-300/80 mt-1">Customer, engineering, supplier and validation context for the selected component.</p>
          </div>
        </div>
        <button onClick={() => onNavigate(14)} className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-110 rounded-xl transition-all shadow-md shadow-cyan-500/25">
          <Sparkles className="w-4 h-4" /><span>AI Communication Summary · Page 14</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto rounded-xl border border-amber-800/40 bg-amber-950/15 px-4 py-3 text-xs text-amber-200/80">
        <ShieldAlert className="inline w-4 h-4 mr-2" />Illustrative component-specific communication scenarios. Replace with approved OEM, supplier and validation records when connected to the document repository.
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-3">
          {threads.map((thread) => {
            const active = thread.id === selectedThreadId;
            return <button key={thread.id} type="button" onClick={() => setSelectedThreadId(thread.id)} className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer group shadow-sm ${active ? 'bg-gradient-to-r from-[#092233] to-[#071724] border-cyan-400/80 ring-2 ring-cyan-500/20' : 'bg-[#07131e]/90 hover:bg-[#0b1d2c] border-teal-900/60'}`}>
              <div className="flex items-center justify-between"><span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-teal-800/40">{thread.stage}</span><span className="text-[10px] font-mono text-slate-400">{thread.date}</span></div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-2">{thread.title}</h3>
              <div className="text-[11px] text-teal-400 mt-0.5">{thread.team}</div>
              <p className="text-xs text-slate-400 mt-2">{thread.preview}</p>
            </button>;
          })}
        </div>

        <div className="lg:col-span-7 bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-teal-900/40 pb-4 space-y-2">
            <div className="flex items-center justify-between"><span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-teal-800/50 px-2.5 py-1 rounded">Stage: {selectedThread.stage}</span><span className="text-xs text-slate-400 font-mono">{selectedThread.date}</span></div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedThread.title}</h2>
            <div className="text-xs text-teal-300 flex items-center gap-1.5 font-medium"><User className="w-3.5 h-3.5 text-cyan-400" /><span>{selectedThread.team}</span></div>
          </div>
          <div className="bg-[#050e17] rounded-xl p-5 border border-teal-950 text-xs sm:text-sm text-slate-200 leading-relaxed">{selectedThread.fullText}</div>
          <div className="pt-4 border-t border-teal-900/40 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400"><ClipboardList className="inline w-4 h-4 mr-1 text-cyan-300" />Selected component: <span className="text-cyan-300 font-semibold">{part.name}</span></div>
            <button onClick={() => onNavigate(14)} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/25 flex items-center gap-2"><span>View AI Synthesized Summary</span><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
