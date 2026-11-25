import React, { useMemo, useState } from 'react';
import { PageId, LifecycleDoc } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';
import { ArrowLeft, FileText, Save, FileCheck2, Paperclip, Mic, CheckCircle2 } from 'lucide-react';

export interface EngineeringReportData {
  docCode: string;
  docTitle: string;
  componentName: string;
  metadata: Record<string, string>;
  questions: { question: string; answer: string }[];
  investigation: { question: string; answer: string }[];
  additional: string;
  attachments: string[];
}

interface Props {
  componentIndex: number;
  doc: LifecycleDoc;
  onNavigate: (page: PageId) => void;
  onGenerateReport: (data: EngineeringReportData) => void;
  backPage?: PageId;
}

type Question = { question: string; options: string[] };

const TEMPLATES: Record<string, { questions: Question[]; investigation: [string, string, string] }> = {
  RFI: { questions: [
    { question: 'What requires clarification?', options: ['Functional requirements', 'Vehicle application', 'Piston rod interface', 'Rod guide interface', 'Rebound travel envelope', 'Other'] },
    { question: 'Which technical parameter is unclear?', options: ['Bumper height', 'Engagement position', 'Compression characteristics', 'Material specification', 'Interface dimensions', 'Other'] },
    { question: 'What is the source of the information gap?', options: ['Customer specification', 'Engineering drawing', 'CAD model', 'Supplier document', 'Internal discussion', 'Other'] },
    { question: 'Which engineering activity is affected?', options: ['Component design', 'Stack-up analysis', 'Material selection', 'Simulation', 'Testing', 'Manufacturing'] },
    { question: 'What is the urgency?', options: ['Critical', 'High', 'Medium', 'Low'] },
  ], investigation: ['What is the problem or information that requires clarification?', 'How did you investigate the issue and identify the information gap?', 'What clarification or resolution was received, and what was the outcome?'] },
  RFQ: { questions: [
    { question: 'What material is required?', options: ['Natural rubber', 'Synthetic rubber', 'Polyurethane', 'TPE', 'Customer-specified material', 'Not finalized'] },
    { question: 'What manufacturing process is proposed?', options: ['Compression moulding', 'Injection moulding', 'Transfer moulding', 'Other', 'Not finalized'] },
    { question: 'What supplier information is required?', options: ['Unit pricing', 'Tooling cost', 'Production capacity', 'Material capability', 'Lead time', 'All'] },
    { question: 'What production quantity is expected?', options: ['Prototype', 'Low volume', 'Medium volume', 'High volume', 'Not finalized'] },
    { question: 'What quotation information is available?', options: ['Technical specification', '2D drawing', '3D CAD', 'Material specification', 'Incomplete requirement package'] },
  ], investigation: ['What sourcing, quotation, or supplier-related challenge needs to be addressed?', 'How did you evaluate suppliers, manufacturing capability, costs, and lead-time assumptions?', 'Which supplier or quotation was selected, and what was the commercial and technical outcome?'] },
  Development: { questions: [
    { question: 'What design activity was performed?', options: ['3D CAD modelling', '2D drawing creation', 'Design modification', 'GD&T definition', 'Design optimization', 'Other'] },
    { question: 'Which geometric parameter was addressed?', options: ['Bumper height', 'Outer diameter', 'Inner diameter', 'Profile', 'Engagement position', 'Interface dimensions'] },
    { question: 'Which material property was evaluated?', options: ['Hardness', 'Resilience', 'Compression set', 'Temperature resistance', 'Fatigue durability', 'Other'] },
    { question: 'What engineering analysis was performed?', options: ['FEA simulation', 'Compression analysis', 'Energy absorption analysis', 'Tolerance analysis', 'Durability analysis', 'No simulation'] },
    { question: 'What design output was generated?', options: ['3D model', '2D drawing', 'GD&T', 'Material specification', 'FEA report', 'Design revision'] },
  ], investigation: ['What design problem, requirement, or engineering constraint was addressed?', 'How did you analyse the design, evaluate alternatives, and identify the cause or design gap?', 'What design solution or revision was implemented, and what was the engineering outcome?'] },
  DV: { questions: [
    { question: 'What validation test was conducted?', options: ['Compression test', 'Force-deflection test', 'Rig durability test', 'Temperature test', 'Ageing test', 'Other'] },
    { question: 'Which parameter was measured?', options: ['Engagement point', 'Compression force', 'Deflection', 'Permanent deformation', 'Hardness change', 'Durability cycles'] },
    { question: 'Under what conditions was testing performed?', options: ['Room temperature', 'High temperature', 'Low temperature', 'Thermal cycling', 'Accelerated ageing', 'Other'] },
    { question: 'What test method was used?', options: ['Component rig test', 'Universal Testing Machine', 'Environmental chamber', 'Dimensional inspection', 'Other'] },
    { question: 'What was the validation result?', options: ['Pass', 'Fail', 'Conditional pass', 'Inconclusive', 'Test pending'] },
  ], investigation: ['What validation issue or unexpected test result was observed?', 'How did you investigate the test data and identify the likely cause?', 'What corrective action or retest was completed, and what was the final validation outcome?'] },
  PV: { questions: [
    { question: 'What production validation activity was performed?', options: ['Off-tool part inspection', 'Trial production', 'Assembly validation', 'Process validation', 'Dimensional validation'] },
    { question: 'Which characteristic was evaluated?', options: ['Bumper dimensions', 'Piston rod fit', 'Engagement position', 'Material consistency', 'Assembly interference'] },
    { question: 'What production process was evaluated?', options: ['Moulding', 'Trimming', 'Finishing', 'Assembly', 'Final inspection'] },
    { question: 'What evidence was collected?', options: ['Dimensional report', 'Material test report', 'Assembly trial report', 'Process capability report', 'Inspection images'] },
    { question: 'What was the validation status?', options: ['Pass', 'Fail', 'Conditional pass', 'Inconclusive', 'Pending'] },
  ], investigation: ['What issue was identified during production validation or the production trial?', 'How did you investigate the process, dimensional, or assembly issue and identify its cause?', 'What corrective action was implemented, and what was the production trial result?'] },
  PP: { questions: [
    { question: 'Which PPAP evidence is available?', options: ['Design records', 'Process flow', 'PFMEA', 'Control plan', 'Dimensional results', 'Material test results'] },
    { question: 'What inspection evidence is submitted?', options: ['Dimensional inspection', 'Material certification', 'Performance test', 'Laboratory report', 'All applicable evidence'] },
    { question: 'What production capability evidence is available?', options: ['Process capability study', 'Measurement system analysis', 'Inspection records', 'Production trial evidence', 'Pending'] },
    { question: 'What is the status of supporting documents?', options: ['Complete', 'Partially complete', 'Under review', 'Missing documents'] },
    { question: 'What is the PSW submission status?', options: ['Not prepared', 'Draft', 'Submitted', 'Approved', 'Rejected'] },
  ], investigation: ['What PPAP submission, evidence, or approval gap needs to be resolved?', 'How did you review the supporting evidence and investigate the documentation or process gap?', 'How was the submission gap resolved, and what is the PSW or approval outcome?'] },
  SOP: { questions: [
    { question: 'What production readiness activity was completed?', options: ['Plant readiness review', 'Job 1 production', 'Work instruction verification', 'Control plan deployment', 'Production trial'] },
    { question: 'Which component revision is released?', options: ['Initial revision', 'Updated revision', 'Customer-approved revision', 'Revision pending confirmation'] },
    { question: 'What production documents are available?', options: ['Work instructions', 'Control plan', 'Process flow', 'Inspection standards', 'All applicable documents'] },
    { question: 'Which launch activity was verified?', options: ['Machine readiness', 'Tooling readiness', 'Material availability', 'Operator training', 'Quality inspection readiness'] },
    { question: 'What is the production launch status?', options: ['Ready for SOP', 'Conditionally ready', 'Delayed', 'On hold', 'Completed'] },
  ], investigation: ['What production launch or readiness issue was identified?', 'How did you investigate plant, tooling, material, process, or quality readiness?', 'What corrective action was completed, and what is the final launch readiness outcome?'] },
  Warranty: { questions: [
    { question: 'What field failure symptom was reported?', options: ['Excessive compression', 'Loss of rebound performance', 'Permanent deformation', 'Cracking or tearing', 'Premature wear', 'Noise or abnormal contact'] },
    { question: 'Under what conditions did the failure occur?', options: ['Normal operation', 'High temperature', 'Low temperature', 'Heavy loading', 'Extended usage', 'Unknown'] },
    { question: 'What physical evidence was observed?', options: ['Surface cracks', 'Shape deformation', 'Material hardening', 'Material softening', 'Dimensional change', 'No visible damage'] },
    { question: 'What investigation was conducted?', options: ['Visual inspection', 'Material analysis', 'Compression testing', 'Hardness testing', 'Durability testing', 'Failure reproduction'] },
    { question: 'What was the field failure severity?', options: ['Critical', 'High', 'Medium', 'Low', 'Under investigation'] },
  ], investigation: ['What field failure or customer concern was reported for the component?', 'How did you investigate the returned part, operating conditions, and evidence to identify the root cause?', 'What containment or corrective action was taken, and what was the field outcome?'] },
};

const titleFor = (code: string) => code === 'Development' ? 'Design Engineering' : code === 'PP' ? 'Production Part Approval' : code === 'Warranty' ? 'Field Failure Analysis' : ({ RFI: 'Request For Information', RFQ: 'Request For Quotation', DV: 'Design Validation', PV: 'Production Validation', SOP: 'Start of Production' } as Record<string,string>)[code] || code;

export const LifecycleDocumentFormPage: React.FC<Props> = ({ componentIndex, doc, onNavigate, onGenerateReport, backPage = 15 }) => {
  const component = COMPONENTS[componentIndex] || COMPONENTS[0];
  const template = TEMPLATES[doc.code] || TEMPLATES.RFI;
  const [metadata, setMetadata] = useState({ documentNumber: `${doc.code.toUpperCase()}-2026-001`, customer: '', vehicleProgram: '', receivedDate: '', dueDate: '', employee: '', department: '', referenceId: '' });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [investigation, setInvestigation] = useState(['', '', '']);
  const [additional, setAdditional] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);
  const allAnswered = template.questions.every((_, i) => Boolean(answers[i]));
  const metadataFields = useMemo(() => [
    { key: 'documentNumber', label: `${doc.code === 'RFI' ? 'RFI' : doc.code} Number` },
    { key: 'customer', label: 'Customer / OEM' },
    { key: 'vehicleProgram', label: 'Vehicle Program' },
    { key: 'receivedDate', label: 'Document Date', type: 'date' },
    { key: 'dueDate', label: 'Target / Response Date', type: 'date' },
    { key: 'employee', label: 'Prepared By' },
    { key: 'department', label: 'Department' },
    { key: 'referenceId', label: 'Reference ID' },
  ], [doc.code]);
  const updateMeta = (key: string, value: string) => setMetadata(prev => ({ ...prev, [key]: value }));
  const generateReport = () => {
    onGenerateReport({
      docCode: doc.code,
      docTitle: titleFor(doc.code),
      componentName: component.name,
      metadata: { ...metadata, component: component.name },
      questions: template.questions.map((q, i) => ({ question: q.question, answer: answers[i] || '' })),
      investigation: template.investigation.map((question, i) => ({ question, answer: investigation[i] || '' })),
      additional,
      attachments: files.map(file => file.name),
    });
    onNavigate(17);
  };

  return <main className="min-h-screen bg-[#020b12] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#103242] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">Lifecycle Document · {doc.code}</p><h1 className="text-2xl font-bold text-white sm:text-3xl">{titleFor(doc.code)}</h1><p className="mt-2 text-sm text-slate-400">Create an engineering record for <span className="font-semibold text-cyan-300">{component.name}</span>.</p></div>
        <button onClick={() => onNavigate(backPage)} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#07566a] bg-[#061722] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-cyan-400"><ArrowLeft className="h-4 w-4"/> {backPage === 32 ? 'Back to Manual Entry' : 'Back to Lifecycle Documents'}</button>
      </header>

      <section className="rounded-xl border border-[#07566a]/70 bg-[#061722] p-5"><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#07566a] bg-[#03131c] text-cyan-400"><FileText className="h-5 w-5"/></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Document Information</p><p className="text-xs text-slate-400">Enter the record details. Component is linked from the previous selection.</p></div></div>
        <div className="mb-4 rounded-lg border border-[#07566a]/50 bg-[#03131c] px-4 py-3"><p className="text-[9px] uppercase tracking-widest text-[#5d9bab]">Selected Component</p><p className="mt-1 text-sm font-semibold text-white">{component.name}</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metadataFields.map(field => <label key={field.key} className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-cyan-300">{field.label}</span><input type={field.type || 'text'} value={metadata[field.key as keyof typeof metadata]} onChange={e => updateMeta(field.key, e.target.value)} className="w-full rounded-lg border border-[#164454] bg-[#03111a] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400" placeholder={field.type ? '' : `Enter ${field.label.toLowerCase()}`}/></label>)}</div>
      </section>

      <section className="rounded-xl border border-[#07566a]/70 bg-[#061722] p-5 sm:p-6"><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">Section 01</p><h2 className="mt-1 text-lg font-semibold text-white">Engineering Information Extraction</h2><p className="mt-1 text-xs text-slate-400">Select the answer that best describes the engineering activity. Choose one option for each question.</p></div>
        <div className="space-y-5">{template.questions.map((q, i) => <div key={q.question} className="border-b border-[#164454]/70 pb-5 last:border-0 last:pb-0"><p className="mb-3 text-sm font-semibold text-slate-100"><span className="mr-2 font-mono text-cyan-400">0{i + 1}</span>{q.question}</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{q.options.map(option => <button key={option} type="button" onClick={() => setAnswers(prev => ({ ...prev, [i]: option }))} className={`rounded-lg border px-3 py-2.5 text-left text-xs transition-colors ${answers[i] === option ? 'border-cyan-400 bg-[#073344] text-cyan-200' : 'border-[#164454] bg-[#03111a] text-slate-300 hover:border-[#25869a] hover:text-white'}`}>{option}</button>)}</div></div>)}</div>
      </section>

      <section className="rounded-xl border border-[#07566a]/70 bg-[#061722] p-5 sm:p-6"><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">Section 02</p><h2 className="mt-1 text-lg font-semibold text-white">Problem Investigation &amp; Resolution</h2><p className="mt-1 text-xs text-slate-400">Provide the actual engineering details in your own words. These fields are not pre-filled.</p></div><div className="space-y-4">{template.investigation.map((question, i) => <label key={question} className="block"><span className="mb-2 block text-xs font-semibold text-slate-200"><span className="mr-2 font-mono text-cyan-400">0{i + 1}</span>{question}</span><textarea rows={3} value={investigation[i]} onChange={e => setInvestigation(prev => prev.map((v, idx) => idx === i ? e.target.value : v))} className="w-full resize-y rounded-lg border border-[#164454] bg-[#03111a] px-3 py-3 text-xs leading-5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400" placeholder="Describe the observed facts, investigation performed, evidence and outcome..."/></label>)}</div></section>

      <section className="rounded-xl border border-[#07566a]/70 bg-[#061722] p-5 sm:p-6"><div className="mb-4"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">Section 03</p><h2 className="mt-1 text-lg font-semibold text-white">Additional Information</h2><p className="mt-1 text-xs text-slate-400">Optional notes and supporting evidence.</p></div><textarea rows={4} value={additional} onChange={e => setAdditional(e.target.value)} className="w-full rounded-lg border border-[#164454] bg-[#03111a] px-3 py-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400" placeholder="Add any additional engineering context, assumptions or notes..."/><label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#287083] bg-[#03131c] px-4 py-4 text-xs text-slate-300 hover:border-cyan-400"><Paperclip className="h-4 w-4 text-cyan-400"/> Attach drawings, test reports, images or other evidence<input type="file" multiple className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))}/></label>{files.length > 0 && <p className="mt-2 text-[11px] text-cyan-300">{files.map(f => f.name).join(' · ')}</p>}</section>

      <footer className="flex flex-col gap-3 rounded-xl border border-[#07566a]/70 bg-[#061722] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="text-xs text-slate-400">{saved ? <span className="inline-flex items-center gap-2 text-emerald-400"><CheckCircle2 className="h-4 w-4"/> Draft saved in this session.</span> : `${Object.keys(answers).length} of 5 engineering questions answered${allAnswered ? ' · Ready for review' : ''}`}</div><div className="flex flex-wrap gap-2"><button onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#286477] bg-[#071b27] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-cyan-400"><Save className="h-4 w-4"/> Save Draft</button><button onClick={generateReport} disabled={!allAnswered || investigation.some(v => !v.trim())} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#03111a] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"><FileCheck2 className="h-4 w-4"/> Preview Engineering Report</button></div></footer>
      <p className="text-[10px] leading-5 text-slate-500">Only information entered by the engineer and attached evidence should be treated as confirmed. AI-generated summaries or conclusions must be reviewed before approval or repository ingestion.</p>
    </div>
  </main>;
};

export default LifecycleDocumentFormPage;
