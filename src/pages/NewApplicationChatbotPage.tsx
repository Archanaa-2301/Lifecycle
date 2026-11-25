import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, Bot, CheckCircle2, CircleAlert, FileText, FileUp,
  Send, Sparkles, UserRound, X,
} from 'lucide-react';
import { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';

interface Props { componentIndex: number; onNavigate: (page: PageId) => void; }
type Role = 'assistant' | 'user';
type ChatMessage = { role: Role; text: string };
type RefKey = 'ford' | 'mercedes';
type RefFile = { file: File; text: string } | null;
type Requirement = { label: string; value: string; group: string };

const GROUPS = [
  { key: 'performance', label: 'Performance & damping', terms: ['damping', 'rebound', 'compression', 'force-velocity', 'noise', 'harshness', 'ride'] },
  { key: 'load', label: 'Loads & durability', terms: ['load', 'kn', 'fatigue', 'cycle', 'durability', 'impact', 'stress'] },
  { key: 'material', label: 'Material & process', terms: ['material', 'steel', 'aluminium', 'aluminum', 'rubber', 'polyurethane', 'hardness', 'coating', 'heat treatment'] },
  { key: 'dimensions', label: 'Dimensions & interfaces', terms: ['dimension', 'diameter', 'length', 'tolerance', 'interface', 'mounting', 'clearance', 'package', 'mm'] },
  { key: 'validation', label: 'Validation & environment', terms: ['validation', 'test', 'acceptance', 'temperature', 'corrosion', 'salt spray'] },
];
const COMPONENT_TERMS: Record<string, string[]> = {
  'Rebound Bumper': ['rebound bumper', 'bump stop', 'compression', 'rebound travel', 'elastomer', 'polyurethane', 'compression set'],
  'Rod Guide': ['rod guide', 'guide bore', 'concentricity', 'seal', 'leakage', 'wear', 'running clearance'],
  Rod: ['piston rod', 'rod diameter', 'straightness', 'surface roughness', 'hardness', 'coating', 'fatigue'],
  'Spring Seat': ['spring seat', 'coil spring', 'seat diameter', 'spring profile', 'spring load', 'corrosion'],
  'Top Mount': ['top mount', 'upper mount', 'mounting pattern', 'body tower', 'stiffness', 'nvh', 'isolation'],
  'Bumper Cap': ['bumper cap', 'retention', 'cover', 'clearance', 'impact resistance', 'temperature resistance'],
};
const readable = (file: File) => /\.(txt|md|csv|json)$/i.test(file.name) || file.type.startsWith('text/');
const bytes = (n: number) => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;

function extractRequirements(text: string): Requirement[] {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const patterns: { label: string; regex: RegExp; group: string }[] = [
    { label: 'Rod diameter', regex: /(?:rod\s+diameter|diameter)[^\n:]*:?\s*([\d.]+\s*mm)/i, group: 'Dimensions' },
    { label: 'Design load', regex: /(?:design\s+load|maximum\s+design\s+load|load\s+input)[^\n:]*:?\s*([\d.]+\s*kN)/i, group: 'Loads' },
    { label: 'Operating temperature', regex: /(?:ambient\s+operating\s+temperature|operating\s+temperature|temperature)[^\n:]*:?\s*(-?[\d.]+\s*°?C\s*(?:to|[-–])\s*\+?[\d.]+\s*°?C)/i, group: 'Environment' },
    { label: 'Durability target', regex: /(?:durability\s+target|durability)[^\n:]*:?\s*([\d,]+\s*(?:equivalent\s+)?(?:road\s+)?cycles?)/i, group: 'Validation' },
    { label: 'Corrosion target', regex: /(?:corrosion\s+(?:exposure|screening|target)|salt[- ]spray)[^\n:]*:?\s*([\d,]+\s*hours?)/i, group: 'Validation' },
    { label: 'Assembly length', regex: /(?:overall\s+assembly\s+length|assembly\s+length)[^\n:]*:?\s*([\d.]+\s*mm)/i, group: 'Dimensions' },
  ];
  const results: Requirement[] = [];
  for (const p of patterns) { const m = text.match(p.regex); if (m?.[1]) results.push({ label: p.label, value: m[1].trim(), group: p.group }); }
  const materials = lines.filter(l => /material family|material requirement|material:/i.test(l)).slice(0, 5);
  materials.forEach((line, i) => results.push({ label: `Material requirement ${i + 1}`, value: line.replace(/^[-•\s]+/, '').slice(0, 150), group: 'Material' }));
  return results;
}
function groupCoverage(text: string) {
  const lower = text.toLowerCase();
  return GROUPS.map(g => ({ ...g, hits: g.terms.filter(term => lower.includes(term)).length, found: g.terms.some(term => lower.includes(term)) }));
}
function scoreReference(customer: string, reference: string) {
  const customerGroups = groupCoverage(customer);
  const refGroups = groupCoverage(reference);
  const groupResults = customerGroups.map(g => {
    const ref = refGroups.find(r => r.key === g.key)!;
    const customerTerms = g.terms.filter(t => customer.toLowerCase().includes(t));
    const matched = customerTerms.filter(t => reference.toLowerCase().includes(t));
    const coverage = customerTerms.length ? matched.length / customerTerms.length : 0;
    return { label: g.label, customerTerms, matched, coverage };
  });
  const available = groupResults.filter(g => g.customerTerms.length > 0);
  const score = available.length ? Math.round(available.reduce((sum, g) => sum + g.coverage, 0) / available.length * 100) : 0;
  return { score, groupResults, availableGroups: available.length };
}

export const NewApplicationChatbotPage: React.FC<Props> = ({ componentIndex, onNavigate }) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [customerText, setCustomerText] = useState('');
  const [ford, setFord] = useState<RefFile>(null);
  const [mercedes, setMercedes] = useState<RefFile>(null);
  const [paste, setPaste] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: `Welcome to LIFEX Design Intelligence. Upload the new customer SOR for ${part.name}. I will extract the requirements and explain what evidence is needed to compare the Ford and Mercedes-Benz references.` }]);
  const [question, setQuestion] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [notice, setNotice] = useState('');

  const sourceText = `${customerText}\n${paste}`.trim();
  const requirements = useMemo(() => extractRequirements(sourceText), [sourceText]);
  const coverage = useMemo(() => groupCoverage(sourceText), [sourceText]);
  const fordResult = useMemo(() => ford?.text ? scoreReference(sourceText, ford.text) : null, [sourceText, ford]);
  const mercedesResult = useMemo(() => mercedes?.text ? scoreReference(sourceText, mercedes.text) : null, [sourceText, mercedes]);
  const recommendation = fordResult && mercedesResult
    ? (fordResult.score > mercedesResult.score ? 'Ford' : mercedesResult.score > fordResult.score ? 'Mercedes-Benz' : 'No clear winner')
    : null;

  const readFile = async (file: File) => readable(file) ? (await file.text()).slice(0, 200000) : '';
  const setDocument = async (kind: 'customer' | RefKey, file?: File) => {
    if (!file) return;
    const text = await readFile(file);
    if (kind === 'customer') { setCustomerFile(file); setCustomerText(text); }
    else if (kind === 'ford') setFord({ file, text });
    else setMercedes({ file, text });
    setReviewed(false);
    setNotice(text ? `${file.name} read locally. Extracted text is available for the comparison.` : `${file.name} selected. This file type is not text-extracted in this browser; use TXT, MD, CSV or JSON for local comparison, or paste its key clauses.`);
    setMessages(old => [...old, { role: 'user', text: `${kind === 'customer' ? 'Customer SOR' : kind === 'ford' ? 'Ford reference SOR' : 'Mercedes-Benz reference SOR'} added: ${file.name} (${bytes(file.size)}).` }, { role: 'assistant', text: text ? `I read the text from ${file.name}. Select Review SOR to see the extracted fields and evidence coverage.` : 'I registered the file, but this prototype cannot extract PDF/DOCX contents locally. Please paste the relevant clauses or provide a TXT/MD version so I can compare the actual text.' }]);
  };
  const review = () => {
    if (!sourceText) { setNotice('Upload a readable SOR or paste its requirements before starting the review.'); return; }
    setReviewed(true);
    const status = ford && mercedes ? 'Both reference files are attached. The displayed text-overlap scores are screening indicators only, not engineering compatibility scores.' : 'Reference SORs are not both available. I can extract the new application requirements, but cannot rank Ford against Mercedes without their controlled reference content.';
    setMessages(old => [...old, { role: 'assistant', text: `SOR review completed for ${part.name}. I extracted ${requirements.length} explicit fields and checked ${coverage.filter(g => g.found).length} of 5 requirement groups. ${status}` }]);
  };
  const ask = (q = question) => {
    const clean = q.trim(); if (!clean) return;
    let answer = '';
    const lower = clean.toLowerCase();
    if (lower.includes('closest') || lower.includes('recommend')) {
      answer = recommendation ? `Based on a simple text-evidence screening of the two uploaded reference SOR texts, ${recommendation} has the higher keyword coverage (${fordResult?.score ?? 0}% Ford; ${mercedesResult?.score ?? 0}% Mercedes-Benz). This is not a validated engineering match. Confirm dimensions, materials, load limits, interfaces and test evidence before selecting a reference.` : 'I cannot responsibly recommend Ford or Mercedes yet. Please attach both reference SORs (or paste their relevant clauses). The new customer SOR alone does not contain the comparison evidence.';
    } else if (lower.includes('missing') || lower.includes('extract')) {
      answer = requirements.length ? `I extracted: ${requirements.map(r => `${r.label}: ${r.value}`).join('; ')}. The groups still needing review are: ${coverage.filter(g => !g.found).map(g => g.label).join(', ') || 'none by keyword screening'}. Please verify every value against the original customer document.` : 'I have not found explicit numeric fields yet. Paste the load cases, material callouts, dimensions, operating temperature and validation targets from the SOR.';
    } else if (lower.includes('component') || lower.includes(part.name.toLowerCase())) {
      answer = `For ${part.name}, focus on ${part.engineering.join('; ')}. Key interfaces: ${part.interfaces.join('; ')}. Validation checks: ${part.checks.join('; ')}. These are component review topics; the customer and reference drawings must supply actual acceptance values.`;
    } else if (lower.includes('score') || lower.includes('compare')) {
      answer = recommendation ? `Text-evidence screening: Ford ${fordResult?.score}% and Mercedes-Benz ${mercedesResult?.score}%. This measures overlap of requirement keywords by category only. It does not assess numeric tolerance, geometry, material grade or safety margin.` : 'Upload both Ford and Mercedes-Benz reference SOR text files to enable a transparent text-evidence screening. A full engineering comparison also requires released drawings, dimensions and working limits.';
    } else {
      answer = `I can help with the ${part.name} SOR. The available component review topics are: ${part.engineering.join('; ')}. Ask me about extracted requirements, missing information, comparison evidence or the closest reference design.`;
    }
    setMessages(old => [...old, { role: 'user', text: clean }, { role: 'assistant', text: answer }]); setQuestion('');
  };

  return <main className="min-h-screen bg-[#040c14] px-4 py-7 text-slate-100 sm:px-8 lifex-page-enter"><div className="mx-auto max-w-6xl">
    <header className="mb-6 flex flex-col justify-between gap-4 border-b border-cyan-950 pb-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400"><Sparkles className="h-4 w-4"/> PAGE 26 · NEW APPLICATION DESIGN INTELLIGENCE</div><h1 className="mt-2 text-3xl font-bold text-white">Find the closest reference design</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Upload one new customer SOR, then add the Ford and Mercedes-Benz reference SORs to compare the selected component: <strong className="text-cyan-200">{part.name}</strong>.</p></div><button onClick={()=>onNavigate(23)} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:border-cyan-400"><ArrowLeft className="h-4 w-4"/> Workspace</button></header>

    <div className="mb-5 grid gap-3 md:grid-cols-3">{[{n:'01',title:'Upload customer SOR',desc:'Provide the new application requirements.'},{n:'02',title:'Add reference SORs',desc:'Attach controlled Ford and Mercedes reference text.'},{n:'03',title:'Review the evidence',desc:'See extracted fields, gaps and a transparent screening result.'}].map(s=><div key={s.n} className="rounded-xl border border-cyan-950 bg-[#071521] p-4"><div className="text-[10px] font-mono text-cyan-400">STEP {s.n}</div><div className="mt-1 text-sm font-semibold text-white">{s.title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{s.desc}</p></div>)}</div>

    <section className="mb-5 rounded-2xl border border-cyan-900/60 bg-[#071521] p-5 shadow-xl"><div className="mb-4 flex items-center gap-2"><FileUp className="h-5 w-5 text-cyan-300"/><h2 className="font-semibold text-white">Application documents</h2></div><div className="grid gap-3 lg:grid-cols-3">
      {[{key:'customer' as const,title:'New customer SOR',sub:'Required · the document to evaluate',file:customerFile},{key:'ford' as const,title:'Ford reference SOR',sub:'Required for Ford comparison',file:ford?.file ?? null},{key:'mercedes' as const,title:'Mercedes-Benz reference SOR',sub:'Required for Mercedes comparison',file:mercedes?.file ?? null}].map(item=><div key={item.key} className="rounded-xl border border-slate-800 bg-[#050f18] p-4"><div className="text-sm font-semibold text-white">{item.title}</div><p className="mt-1 min-h-8 text-[11px] text-slate-500">{item.sub}</p>{item.file?<div className="mt-3 flex items-center gap-2 text-xs text-teal-200"><CheckCircle2 className="h-4 w-4 shrink-0"/><span className="truncate">{item.file.name}</span><button onClick={()=>{if(item.key==='customer'){setCustomerFile(null);setCustomerText('')}else if(item.key==='ford')setFord(null);else setMercedes(null);setReviewed(false)}} className="ml-auto text-slate-500 hover:text-white"><X className="h-4 w-4"/></button></div>:<label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-800/70 px-3 py-2 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-950/40"><FileUp className="h-4 w-4"/>Upload document<input type="file" accept=".txt,.md,.csv,.json,.pdf,.doc,.docx" className="hidden" onChange={e=>{void setDocument(item.key,e.target.files?.[0]);e.target.value=''}}/></label>}</div>)}
    </div><div className="mt-4"><label className="mb-2 block text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Paste SOR text / reference clauses (optional)</label><textarea value={paste} onChange={e=>{setPaste(e.target.value);setReviewed(false)}} rows={4} placeholder="Paste the readable clauses from the customer SOR or reference documents…" className="w-full rounded-xl border border-slate-700 bg-[#081a27] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"/></div>{notice&&<p className="mt-3 text-xs leading-5 text-amber-200/90">{notice}</p>}<div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-[10px] text-slate-500">Local text parsing: TXT, MD, CSV, JSON. PDF/DOCX require text to be pasted in this prototype.</span><button onClick={review} disabled={!customerText.trim()&&!paste.trim()} className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-[#041019] transition hover:bg-cyan-300 disabled:opacity-40">Analyse application SOR</button></div></section>

    {reviewed&&<section className="mb-5 rounded-2xl border border-cyan-900/60 bg-[#071521] p-5"><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-teal-300"/><h2 className="font-semibold text-white">Extracted SOR review · {part.name}</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{requirements.length?requirements.map((r,i)=><div key={`${r.label}-${i}`} className="rounded-xl border border-slate-800 bg-[#050f18] p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{r.group}</div><div className="mt-1 text-xs font-semibold text-slate-200">{r.label}</div><div className="mt-1 text-sm text-cyan-200">{r.value}</div></div>):<p className="text-xs text-slate-400">No structured numeric fields detected. Review the pasted text and add missing requirements.</p>}</div><h3 className="mt-5 text-xs font-semibold text-white">Requirement group coverage</h3><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{coverage.map(g=><div key={g.key} className={`rounded-lg border p-3 text-xs ${g.found?'border-teal-800 bg-teal-950/20 text-teal-100':'border-slate-800 bg-[#050f18] text-slate-500'}`}>{g.found?'✓':'○'} {g.label}</div>)}</div><div className="mt-5 grid gap-3 md:grid-cols-2">{[{name:'Ford',result:fordResult},{name:'Mercedes-Benz',result:mercedesResult}].map(r=><div key={r.name} className="rounded-xl border border-slate-800 bg-[#050f18] p-4"><div className="text-sm font-semibold text-white">{r.name} reference</div>{r.result?<><div className="mt-2 text-2xl font-bold text-cyan-200">{r.result.score}% <span className="text-xs font-normal text-slate-500">text-evidence overlap</span></div><p className="mt-1 text-[10px] text-slate-500">Based on matching requirement keywords by category; not a dimensional or engineering compatibility score.</p></>:<div className="mt-2 text-xs text-amber-200">Reference SOR text not supplied — not scored.</div>}</div>)}</div>{recommendation&&<div className="mt-4 rounded-xl border border-amber-700/50 bg-amber-950/20 p-4"><div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Preliminary text-screening result</div><div className="mt-1 text-lg font-bold text-white">{recommendation==='No clear winner'?'No clear text-evidence winner':`${recommendation} has higher text-evidence overlap`}</div><p className="mt-1 text-xs leading-5 text-slate-300">This result only compares text coverage. It does not prove geometry, material, load-limit, safety or validation compatibility. Engineering approval requires controlled drawings and specifications.</p></div>}</section>}

    <section className="overflow-hidden rounded-2xl border border-cyan-900/60 bg-[#071521] shadow-2xl"><div className="flex items-center gap-3 border-b border-cyan-950 bg-[#0a1c29] px-5 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300"><Bot className="h-6 w-6"/></div><div><div className="text-sm font-semibold text-white">LIFEX Application Matching Assistant</div><div className="text-[10px] text-emerald-300">SOR-guided engineering assistant · local rule-based prototype</div></div></div><div className="max-h-[360px] min-h-[220px] space-y-4 overflow-y-auto p-5">{messages.map((m,i)=><div key={i} className={`flex gap-3 ${m.role==='user'?'justify-end':''}`}><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.role==='assistant'?'bg-cyan-950 text-cyan-300':'bg-slate-800 text-slate-200'}`}>{m.role==='assistant'?<Bot className="h-4 w-4"/>:<UserRound className="h-4 w-4"/>}</div><div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${m.role==='assistant'?'border border-cyan-950 bg-[#0a1d2a] text-slate-200':'bg-cyan-500/15 text-cyan-50'}`}>{m.text}</div></div>)}</div><div className="border-t border-cyan-950 bg-[#06131e] p-4"><div className="mb-3 flex flex-wrap gap-2">{['What requirements were extracted?','What information is missing?','Which design is closest?','What should I check for this component?'].map(q=><button key={q} onClick={()=>ask(q)} className="rounded-full border border-cyan-900/70 px-3 py-1.5 text-[10px] text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-950/40">{q}</button>)}</div><div className="flex items-center gap-2"><input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')ask()}} placeholder="Ask about requirements, gaps or design comparison…" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#081a27] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"/><button onClick={()=>ask()} disabled={!question.trim()} className="flex h-11 items-center gap-2 rounded-xl bg-cyan-500 px-4 text-xs font-bold text-[#041019] transition hover:bg-cyan-300 disabled:opacity-40"><Send className="h-4 w-4"/><span className="hidden sm:inline">Send</span></button></div></div></section>
    <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-slate-500"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"/><p>This is a local rule-based prototype, not a live generative-AI service. The optional reference screening measures text overlap only. It does not replace CAD/drawing comparison, engineering calculations, approved working limits or design-authority approval. No Ford or Mercedes specification is fabricated.</p></div>
    <div className="mt-5 flex justify-between"><button onClick={()=>onNavigate(25)} className="rounded-xl border border-slate-700 px-4 py-3 text-xs text-slate-300">← Reference Applications</button><button onClick={()=>onNavigate(23)} className="rounded-xl border border-cyan-400/50 bg-cyan-500/10 px-5 py-3 text-xs font-semibold text-cyan-200">Back to Engineering Workspace</button></div>
  </div></main>;
};
