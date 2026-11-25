import React from 'react';
import { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';
import { Sparkles, ArrowLeft, ArrowRight, AlertCircle, HelpCircle, MessageSquare, Search, CheckCircle2, CalendarCheck, FileText } from 'lucide-react';

interface CommunicationSummaryPageProps { componentIndex: number; onNavigate: (page: PageId) => void; }

export const CommunicationSummaryPage: React.FC<CommunicationSummaryPageProps> = ({ componentIndex, onNavigate }) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];
  const summaryItems = [
    { title: 'Customer Problem', icon: AlertCircle, color: 'text-amber-400', bgColor: 'bg-amber-950/20 border-amber-800/40', content: `Confirm that the ${part.name.toLowerCase()} fulfils its intended function: ${part.purpose}` },
    { title: 'Customer Request', icon: HelpCircle, color: 'text-sky-400', bgColor: 'bg-sky-950/20 border-sky-800/40', content: `Confirm application requirements and the component's interfaces: ${part.interfaces.join('; ')}.` },
    { title: 'Engineering Discussion', icon: MessageSquare, color: 'text-cyan-400', bgColor: 'bg-cyan-950/20 border-cyan-800/40', content: `${part.operation} Design review should address: ${part.engineering.slice(0, 2).join('; ')}.` },
    { title: 'Root Cause / Risk Focus', icon: Search, color: 'text-rose-400', bgColor: 'bg-rose-950/20 border-rose-800/40', content: `No confirmed root cause is supplied. Component-specific risk areas to assess include: ${part.engineering.join('; ')}.` },
    { title: 'Corrective Action / Design Response', icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-950/20 border-emerald-800/40', content: `Resolve design and interface actions through the released drawing, specification and change-control process. Focus areas: ${part.checks.slice(0, 2).join('; ')}.` },
    { title: 'Validation Status', icon: CalendarCheck, color: 'text-teal-400', bgColor: 'bg-teal-950/20 border-teal-800/40', content: `Verification focus: ${part.checks.join('; ')}. Actual pass/fail status and acceptance limits must be populated from approved test evidence.` },
  ];

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6 lifex-page-enter">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400"><Sparkles className="w-3.5 h-3.5" /><span>AI Lifecycle Intelligence Synthesis</span></div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">Communication Summary · {part.name}</h1>
          <p className="text-xs sm:text-sm text-teal-300/80 mt-1">Component-focused synthesis across customer, engineering, supplier and validation topics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(13)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"><ArrowLeft className="w-4 h-4" /><span>Back to Communications</span></button>
          <button onClick={() => onNavigate(15)} className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25"><span>Open Lifecycle Documents</span><ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto rounded-xl border border-amber-800/40 bg-amber-950/15 px-4 py-3 text-xs text-amber-200/80"><FileText className="inline w-4 h-4 mr-2" />This is a component-specific engineering synthesis template. It does not represent verified customer findings or completed validation.</div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {summaryItems.map((item, idx) => { const Icon = item.icon; return <article key={item.title} className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between ${item.bgColor} bg-[#071421]/90`}>
          <div><div className="flex items-center gap-2.5 mb-3"><div className="p-2 rounded-xl bg-[#050e17] border border-teal-900/60"><Icon className={`w-5 h-5 ${item.color}`} /></div><h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3></div><p className="text-xs text-slate-300 leading-relaxed mt-2 bg-[#050e17]/60 p-3 rounded-xl border border-teal-950">{item.content}</p></div>
          <div className="mt-4 pt-3 border-t border-teal-900/30 flex items-center justify-between text-[11px] text-teal-400 font-mono"><span>{part.name}</span><span>Focus {idx + 1}/6</span></div>
        </article>; })}
      </div>

      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#092233] to-[#071824] border border-cyan-500/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1"><div className="text-sm font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-400" /><span>Continue to the lifecycle document library</span></div><p className="text-xs text-slate-300">Review the original APQP document types with relevance notes for {part.name}.</p></div>
        <button onClick={() => onNavigate(15)} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/25 flex items-center gap-2"><span>Open Lifecycle Documents · Page 15</span><ArrowRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
