import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, FileQuestion, FileStack, Settings2, Handshake } from 'lucide-react';
import { COMPONENTS } from './componentKnowledge';
import { PageId, LifecycleDoc } from '../types/lifex';
import { RepositoryName } from '../utils/repositoryStore';
import { runSelectionFlight } from '../utils/selectionMotion';

type Props = { componentIndex: number; onNavigate: (page: PageId) => void; onSelectDoc: (doc: LifecycleDoc) => void };
const OPTIONS = [
  { label: 'Design / Engineering Query (RFI)', id: 'rfi', icon: FileQuestion, description: 'Open the existing RFI form and engineering inquiry workflow.' },
  { label: 'Request for Quotation (RFQ)', id: 'rfq', icon: FileStack, description: 'Open the existing RFQ form and supplier quotation workflow.' },
  { label: 'Design / Development Update', id: 'dev', icon: Settings2, description: 'Open the existing design and development record workflow.' },
  { label: 'Engineering Decision / Approval', id: 'pp', icon: Handshake, description: 'Open the existing approval and engineering decision record.' },
];
const DOCS: Record<string, LifecycleDoc> = {
  rfi: { id: 'rfi', code: 'RFI', name: 'Request For Information', subtext: 'Engineering Problem Investigation & Data Query', recordsCount: 14, status: 'Completed' },
  rfq: { id: 'rfq', code: 'RFQ', name: 'Request For Quotation', subtext: 'Supplier Cost Benchmarking & Tooling Capex', recordsCount: 9, status: 'Completed' },
  dev: { id: 'dev', code: 'Development', name: 'Design Engineering', subtext: 'CAD 3D Models, FEA Simulation & Tolerances', recordsCount: 22, status: 'Completed' },
  pp: { id: 'pp', code: 'PP', name: 'Production Part Approval', subtext: 'PPAP Level 3 Submission & PSW Sign-off', recordsCount: 8, status: 'In Progress' },
};
export const RepositoryManualEntryPage: React.FC<Props> = ({ componentIndex, onNavigate, onSelectDoc }) => {
  const component = COMPONENTS[componentIndex] || COMPONENTS[0];
  const repository = (localStorage.getItem('lifex-selected-repository') || 'Know-How') as RepositoryName;
  const [selectionBusy, setSelectionBusy] = useState(false);
  const chooseWorkflow = (optionId: string, source: HTMLButtonElement) => {
    if (selectionBusy) return; setSelectionBusy(true);
    runSelectionFlight(source, { title: OPTIONS.find(item => item.id === optionId)?.label || 'Engineering workflow', subtitle: 'MANUAL ENTRY WORKFLOW', imageSrc: '/lifex-logo.png', targetLabel: 'WORKFLOW SELECTED', target: { left: 28, top: Math.round(window.innerHeight * .43), width: 246, height: 76 }, duration: 920, onComplete: () => { onSelectDoc(DOCS[optionId]); onNavigate(16); } });
  };
  return <main className="min-h-screen bg-[#020b12] px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lifex-page-enter"><div className="mx-auto max-w-6xl space-y-6">
    <button onClick={() => onNavigate(31)} className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100"><ArrowLeft size={17}/> Back to {repository}</button>
    <header className="border-b border-[#103242] pb-5"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">{repository} / Manual Entry</p><h1 className="mt-2 text-3xl font-bold text-white">Manual Entry</h1><p className="mt-2 text-sm text-slate-400">Choose an existing engineering entry workflow for <span className="font-semibold text-cyan-300">{component.name}</span>.</p></header>
    <section className="grid gap-3 sm:grid-cols-2">{OPTIONS.map(option => { const Icon = option.icon; return <button key={option.id} onClick={(event) => chooseWorkflow(option.id, event.currentTarget)} disabled={selectionBusy} className="group flex min-h-36 items-start gap-4 rounded-2xl border border-[#145064] bg-gradient-to-b from-[#062432] to-[#03131d] p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_22px_rgba(0,210,235,.12)]"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-800 bg-[#03131d]"><Icon className="h-6 w-6 text-cyan-300"/></span><span className="min-w-0 flex-1"><span className="block text-base font-bold text-white">{option.label}</span><span className="mt-2 block text-xs leading-5 text-slate-400">{option.description}</span><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300">Open workflow <ArrowRight size={15} className="transition group-hover:translate-x-1"/></span></span></button>; })}</section>
  </div></main>;
};
