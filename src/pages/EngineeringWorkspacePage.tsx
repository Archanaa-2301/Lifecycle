import React from 'react';
import { ArrowLeft, ArrowRight, Gauge, Layers3, MessageCircle, Sparkles } from 'lucide-react';
import { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';

interface Props { componentIndex: number; onNavigate: (page: PageId) => void; }

const options = [
  { page: 24 as PageId, title: 'Working Limits', eyebrow: 'DESIGN RULES & CONSTRAINTS', description: 'Review component-specific load cases, material requirements, operating boundaries and validation checks.', icon: Gauge, tag: 'Engineering guardrails', accent: 'cyan' },
  { page: 25 as PageId, title: 'Reference Applications', eyebrow: 'FORD & MERCEDES BENCHMARKS', description: 'Explore the two reference applications, their assembly evidence and the component dimensions to compare.', icon: Layers3, tag: 'Reference design library', accent: 'teal' },
  { page: 26 as PageId, title: 'New Application', eyebrow: 'SOR MATCHING ASSISTANT', description: 'Chat with the application assistant. Share a new customer SOR and find the closest matching reference design.', icon: MessageCircle, tag: 'AI-assisted evaluation', accent: 'sky' },
];

export const EngineeringWorkspacePage: React.FC<Props> = ({ componentIndex, onNavigate }) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];
  return <main className="min-h-screen bg-[#040c14] px-4 py-8 text-slate-100 sm:px-8 lifex-page-enter">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col gap-4 border-b border-cyan-950/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-cyan-400"><Sparkles className="h-4 w-4"/> Engineering decision workspace · Page 23</div><h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Continue with engineering intelligence</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">The lifecycle library is complete. Choose how to evaluate <span className="font-semibold text-cyan-200">{part.name}</span> against engineering constraints and reference applications.</p></div>
        <button onClick={() => onNavigate(15)} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-[#081521] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-white"><ArrowLeft className="h-4 w-4"/> Back to Lifecycle Documents</button>
      </header>
      <div className="mb-6 rounded-2xl border border-cyan-900/50 bg-gradient-to-r from-[#092333] to-[#071522] p-5"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-300">Selected engineering context</div><div className="mt-1 text-lg font-semibold text-white">{part.name} <span className="ml-2 text-xs font-medium text-slate-400">{part.group}</span></div><p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">{part.purpose}</p></div>
      <div className="grid gap-5 lg:grid-cols-3">{options.map((item) => { const Icon = item.icon; return <button key={item.page} onClick={() => onNavigate(item.page)} className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-cyan-950 bg-[#071521] p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-cyan-950/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/5 blur-2xl transition group-hover:bg-cyan-400/10"/><div className="relative flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-800/60 bg-cyan-950/60 text-cyan-300"><Icon className="h-6 w-6"/></div><ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300"/></div><div className="relative mt-7 text-[9px] font-bold uppercase tracking-[.2em] text-cyan-400">{item.eyebrow}</div><h2 className="relative mt-2 text-2xl font-bold text-white">{item.title}</h2><p className="relative mt-3 flex-1 text-sm leading-6 text-slate-400">{item.description}</p><div className="relative mt-5 inline-flex w-fit rounded-full border border-teal-900/70 bg-teal-950/30 px-3 py-1 text-[10px] font-semibold text-teal-200">{item.tag}</div></button>; })}</div>
      <p className="mt-7 text-center text-[11px] text-slate-500">Choose a workspace to continue. The selected component context is carried into each destination.</p>
    </div>
  </main>;
};
