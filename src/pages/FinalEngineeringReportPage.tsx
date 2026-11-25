import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { EngineeringReportData } from './LifecycleDocumentFormPage';
import { ArrowLeft, Printer, FileText, Paperclip, Save, CheckCircle2, X } from 'lucide-react';
import { createPDFBase64, writeRepositoryPDF, RepositoryName } from '../utils/repositoryStore';

interface FinalEngineeringReportPageProps {
  onNavigate: (page: PageId) => void;
  reportData: EngineeringReportData | null;
}

const displayValue = (value?: string) => value?.trim() ? value : 'Not provided';

export const FinalEngineeringReportPage: React.FC<FinalEngineeringReportPageProps> = ({ onNavigate, reportData }) => {
  const handlePrint = () => window.print();
  const [repositoryDialogOpen, setRepositoryDialogOpen] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState<RepositoryName>('Know-How');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const repositories: RepositoryName[] = [
    'Know-How', 'Project Management', 'Change Management', 'Warranty / Field Return / Failure',
  ];

  const handleSaveToRepository = async () => {
    if (!reportData || saving) return;
    setSaving(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const lines = [
        `Document type: ${reportData.docCode}`,
        `Component: ${reportData.componentName}`,
        ...Object.entries(reportData.metadata).map(([key, value]) => `${key}: ${value || 'Not provided'}`),
        '', 'ENGINEERING INFORMATION',
        ...reportData.questions.flatMap((item, index) => [`${index + 1}. ${item.question}`, item.answer || 'Not provided', '']),
        'PROBLEM INVESTIGATION & RESOLUTION',
        ...reportData.investigation.flatMap((item, index) => [`${index + 1}. ${item.question}`, item.answer || 'Not provided', '']),
        'ADDITIONAL INFORMATION', reportData.additional || 'Not provided',
        'SUPPORTING ATTACHMENTS', ...(reportData.attachments.length ? reportData.attachments : ['No attachments provided']),
        '', 'This report reflects the information entered in the lifecycle document form. Blank fields are marked Not provided.',
      ];
      const pdfBase64 = createPDFBase64(`${reportData.docTitle} Report`, lines);
      const id = `manual-${reportData.docCode}-${reportData.metadata.documentNumber || 'report'}-${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      await writeRepositoryPDF({
        id,
        title: `${reportData.docTitle} - ${reportData.metadata.documentNumber || reportData.docCode}`,
        sourceType: 'Manual Entry',
        component: `${reportData.componentName} (RB-001)`,
        repository: selectedRepository,
        savedAt: new Date().toISOString(),
        sourceDate: reportData.metadata.receivedDate || new Date().toISOString().slice(0, 10),
        pdfBase64,
      });
      setSaveMessage(`Saved successfully to ${selectedRepository}.`);
      setRepositoryDialogOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save this report. Please check that the LIFEX repository server is running.');
    } finally {
      setSaving(false);
    }
  };

  if (!reportData) {
    return (
      <main className="min-h-screen bg-[#040c14] p-6 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-2xl border border-teal-900/60 bg-[#07131e] p-8">
          <h1 className="text-xl font-bold">No report data available</h1>
          <p className="mt-2 text-sm text-slate-400">Complete a lifecycle document form and select Preview Engineering Report.</p>
          <button onClick={() => onNavigate(16)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-[#03111a]"><ArrowLeft className="h-4 w-4"/> Return to form</button>
        </div>
      </main>
    );
  }

  const metadataLabels: Record<string, string> = {
    documentNumber: `${reportData.docCode} Number`, customer: 'Customer / OEM', vehicleProgram: 'Vehicle Program',
    receivedDate: 'Document Date', dueDate: 'Target / Response Date', employee: 'Prepared By',
    department: 'Department', referenceId: 'Reference ID', component: 'Component',
  };

  return (
    <main className="min-h-screen bg-[#040c14] p-4 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col justify-between gap-4 border-b border-teal-900/40 pb-5 sm:flex-row sm:items-center print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate(16)} className="rounded-xl border border-teal-800/60 bg-[#081521] p-2 text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4"/></button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">LIFEX Engineering Dossier · {reportData.docCode}</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{reportData.docTitle} Report</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => { setSaveError(''); setSaveMessage(''); setRepositoryDialogOpen(true); }} className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/70 bg-[#082331] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-cyan-300 transition hover:bg-cyan-950 hover:text-white active:scale-[.98]"><Save className="h-4 w-4"/> Save to Repository</button>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040e17] hover:bg-cyan-300"><Printer className="h-4 w-4"/> Print / Save as PDF</button>
          </div>
        </header>

        {saveMessage && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-700/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{saveMessage}</div>}
        {saveError && <div role="alert" className="rounded-xl border border-rose-700/60 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">{saveError}</div>}

        {repositoryDialogOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="repository-save-title">
          <div className="w-full max-w-md rounded-2xl border border-cyan-800/70 bg-[#07131e] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">LIFEX Knowledge Repository</p><h2 id="repository-save-title" className="mt-1 text-xl font-bold text-white">Save engineering report</h2><p className="mt-2 text-sm text-slate-400">Choose where this PDF should be stored.</p></div>
              <button type="button" onClick={() => setRepositoryDialogOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <label htmlFor="target-repository" className="mt-5 block text-xs font-semibold uppercase tracking-wide text-cyan-200">Destination repository</label>
            <select id="target-repository" value={selectedRepository} onChange={event => setSelectedRepository(event.target.value as RepositoryName)} className="mt-2 w-full rounded-xl border border-cyan-900 bg-[#04101a] px-3 py-3 text-sm text-white outline-none focus:border-cyan-400">
              {repositories.map(repository => <option key={repository} value={repository}>{repository}</option>)}
            </select>
            <div className="mt-4 rounded-lg border border-slate-800 bg-[#050e17] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">Document</p><p className="mt-1 text-sm font-semibold text-white">{reportData.docTitle}</p><p className="mt-1 text-xs text-slate-400">{reportData.componentName} · {reportData.metadata.documentNumber || reportData.docCode}</p></div>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setRepositoryDialogOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">Cancel</button><button type="button" disabled={saving} onClick={handleSaveToRepository} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-[#03111a] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving...' : 'Confirm Save'}</button></div>
          </div>
        </div>}

        <article className="space-y-8 rounded-2xl border border-teal-900/60 bg-[#07131e]/95 p-6 shadow-2xl sm:p-10 print:border-slate-300 print:bg-white print:text-black print:shadow-none">
          <div className="flex items-start gap-3 border-b border-teal-900/40 pb-6 print:border-slate-300">
            <div className="rounded-xl border border-teal-800/60 bg-[#050e17] p-3 text-cyan-400 print:border-slate-300 print:bg-slate-50"><FileText className="h-6 w-6"/></div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-bold text-cyan-400 print:text-slate-700">{reportData.docCode} · {displayValue(reportData.metadata.documentNumber)}</p>
              <h2 className="mt-1 text-2xl font-bold text-white print:text-black">{reportData.docTitle}</h2>
              <p className="mt-2 text-sm text-slate-400 print:text-slate-700">Component: <span className="font-semibold text-cyan-300 print:text-black">{reportData.componentName}</span></p>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="border-b border-teal-900/40 pb-2 text-sm font-bold uppercase tracking-wider text-cyan-300 print:border-slate-300 print:text-black">01 · Document Information</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(metadataLabels).map(([key, label]) => (
                <div key={key} className="rounded-xl border border-teal-950 bg-[#050e17] p-3 print:border-slate-200 print:bg-slate-50">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-white print:text-black">{displayValue(reportData.metadata[key])}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="border-b border-teal-900/40 pb-2 text-sm font-bold uppercase tracking-wider text-cyan-300 print:border-slate-300 print:text-black">02 · Engineering Information Extraction</h3>
            {reportData.questions.map((item, index) => (
              <div key={`${index}-${item.question}`} className="rounded-xl border border-teal-950 bg-[#050e17] p-4 print:border-slate-200 print:bg-slate-50">
                <p className="text-xs font-semibold text-slate-300 print:text-slate-700"><span className="mr-2 font-mono text-cyan-400 print:text-black">{String(index + 1).padStart(2, '0')}</span>{item.question}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white print:text-black">{displayValue(item.answer)}</p>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <h3 className="border-b border-teal-900/40 pb-2 text-sm font-bold uppercase tracking-wider text-cyan-300 print:border-slate-300 print:text-black">03 · Problem Investigation &amp; Resolution</h3>
            {reportData.investigation.map((item, index) => (
              <div key={`${index}-${item.question}`} className="space-y-2">
                <p className="text-xs font-semibold text-cyan-200 print:text-slate-800"><span className="mr-2 font-mono">{String(index + 1).padStart(2, '0')}</span>{item.question}</p>
                <div className="min-h-16 whitespace-pre-wrap rounded-xl border border-teal-950 bg-[#050e17] p-4 text-sm leading-6 text-slate-100 print:border-slate-200 print:bg-slate-50 print:text-black">{displayValue(item.answer)}</div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <h3 className="border-b border-teal-900/40 pb-2 text-sm font-bold uppercase tracking-wider text-cyan-300 print:border-slate-300 print:text-black">04 · Additional Information</h3>
            <div className="whitespace-pre-wrap rounded-xl border border-teal-950 bg-[#050e17] p-4 text-sm leading-6 text-slate-100 print:border-slate-200 print:bg-slate-50 print:text-black">{displayValue(reportData.additional)}</div>
            <div className="rounded-xl border border-teal-950 bg-[#050e17] p-4 print:border-slate-200 print:bg-slate-50">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300 print:text-slate-700"><Paperclip className="h-4 w-4 text-cyan-400 print:text-black"/> Supporting Attachments</p>
              {reportData.attachments.length ? <ul className="list-disc space-y-1 pl-5 text-sm text-white print:text-black">{reportData.attachments.map(name => <li key={name}>{name}</li>)}</ul> : <p className="text-sm text-slate-400 print:text-slate-700">No attachments provided.</p>}
            </div>
          </section>

          <p className="border-t border-teal-900/40 pt-4 text-[11px] leading-5 text-slate-400 print:border-slate-300 print:text-slate-600">This report reflects the information entered in the lifecycle document form. Blank fields are marked “Not provided”. No test results, root causes, customer responses, approvals or conclusions have been inferred or added.</p>
        </article>
      </div>
    </main>
  );
};
