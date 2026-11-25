import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FileText, Eye, Download, ClipboardPenLine, Search, FolderKanban, GitBranch, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPONENTS } from './componentKnowledge';
import { readRepositoryPDFs, viewPDF, openPDF, type RepositoryName, type RepositoryPDF } from '../utils/repositoryStore';
import { PageId } from '../types/lifex';

type Props = { componentIndex: number; onNavigate: (page: PageId) => void };
type SeedDocument = { id: string; title: string; repository: RepositoryName; component?: string; sourceType?: string; sourceDate?: string; savedAt?: string; pdfUrl: string };
const REPOSITORIES: { name: RepositoryName; folder: string; icon: React.ReactNode; summary: string; prefix: string }[] = [
  { name: 'Know-How', folder: 'Know-How', icon: <BookOpen />, summary: 'Engineering guidelines, design rules and component knowledge', prefix: 'RB-KH-' },
  { name: 'Project Management', folder: 'Project_Management', icon: <FolderKanban />, summary: 'Project planning, APQP, reviews and delivery records', prefix: 'PM-' },
  { name: 'Change Management', folder: 'Change_Management', icon: <GitBranch />, summary: 'Engineering changes, technical impact and approvals', prefix: 'CM-' },
  { name: 'Warranty / Field Return / Failure', folder: 'Warranty___Field_Return___Failure', icon: <ShieldCheck />, summary: 'Warranty, field returns, failure analysis and CAPA', prefix: 'WF-' },
];

export const ComponentRepositoryPage: React.FC<Props> = ({ componentIndex, onNavigate }) => {
  const component = COMPONENTS[componentIndex] || COMPONENTS[0];
  const [repository, setRepository] = useState<RepositoryName>(() => {
    const saved = localStorage.getItem('lifex-selected-repository') as RepositoryName | null;
    return saved && REPOSITORIES.some(r => r.name === saved) ? saved : 'Know-How';
  });
  const [documents, setDocuments] = useState<RepositoryPDF[]>(readRepositoryPDFs);
  const [seedDocuments, setSeedDocuments] = useState<SeedDocument[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const activeRepo = REPOSITORIES.find(r => r.name === repository)!;
  useEffect(() => {
    const refresh = () => setDocuments(readRepositoryPDFs());
    window.addEventListener('lifex-repository-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('lifex-repository-updated', refresh); window.removeEventListener('storage', refresh); };
  }, []);
  useEffect(() => {
    let active = true; setLoading(true); setQuery('');
    fetch(`/api/repository-documents?repository=${encodeURIComponent(repository)}`)
      .then(r => { if (!r.ok) throw new Error('Could not load repository'); return r.json(); })
      .then((rows: SeedDocument[]) => { if (active) setSeedDocuments(rows); })
      .catch(() => { if (active) setSeedDocuments([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [repository]);
  const savedDocs = documents.filter(d => d.repository === repository);
  const visibleSeedDocs = useMemo(() => seedDocuments.filter(d => `${d.title} ${d.id}`.toLowerCase().includes(query.toLowerCase())), [seedDocuments, query]);
  const visibleSavedDocs = savedDocs.filter(d => d.title.toLowerCase().includes(query.toLowerCase()));
  const openSeedPdf = (doc: SeedDocument) => window.open(doc.pdfUrl, '_blank', 'noopener,noreferrer');
  const chooseRepository = (value: RepositoryName) => { setRepository(value); localStorage.setItem('lifex-selected-repository', value); };
  return <main className="lk-page lk-repository-browser-page">
    <div className="lk-repository-shell">
      <button onClick={() => onNavigate(13)} className="lk-repository-back"><ArrowLeft/> Back to Component Workspace</button>
      <header className="lk-repository-page-heading"><div><span className="lk-workspace-kicker">COMPONENT WORKSPACE / KNOWLEDGE REPOSITORY</span><h1>{repository}</h1><p>Browse the original engineering document collection for <strong>{component.name}</strong>.</p></div><div className="lk-repository-total"><strong>{seedDocuments.length || 15}</strong><span>REFERENCE DOCUMENTS</span></div></header>
      <nav className="lk-repository-tabs">{REPOSITORIES.map(repo => <button key={repo.name} onClick={() => chooseRepository(repo.name)} className={repository === repo.name ? 'active' : ''}><span>{repo.icon}</span><strong>{repo.name}</strong><small>15 documents</small></button>)}</nav>
      <section className="lk-repository-browser-card">
        <div className="lk-repository-browser-head"><div><span className="lk-repository-eyebrow">{activeRepo.prefix} DOCUMENT COLLECTION</span><h2>{repository} Documents</h2><p>{activeRepo.summary}</p></div><span className="lk-document-count"><CheckCircle2/> {seedDocuments.length || 15} original documents</span></div>
        <label className="lk-repository-search"><Search/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search document title or ID..."/><kbd>SEARCH</kbd></label>
        {loading ? <div className="lk-repository-loading"><span/> Loading original documents…</div> : <div className="lk-repository-document-grid">
          {visibleSeedDocs.map((doc, i) => <article key={doc.id} className="lk-seed-document-card" style={{'--doc-delay':`${Math.min(i,14)*35}ms`} as React.CSSProperties}><div className="lk-seed-file-icon"><FileText/></div><div className="lk-seed-doc-copy"><small>{doc.id}</small><strong>{doc.title}</strong><span>{doc.sourceType || 'Engineering document'}{doc.sourceDate ? ` · ${doc.sourceDate}` : ''}</span></div><div className="lk-seed-doc-actions"><button title="View PDF" onClick={() => openSeedPdf(doc)}><Eye/></button><a title="Open PDF" href={doc.pdfUrl} download><Download/></a></div></article>)}
          {visibleSavedDocs.map(doc => <article key={doc.id} className="lk-seed-document-card saved"><div className="lk-seed-file-icon"><FileText/></div><div className="lk-seed-doc-copy"><small>USER-SAVED RECORD</small><strong>{doc.title}</strong><span>{doc.sourceType} · {doc.sourceDate}</span></div><div className="lk-seed-doc-actions"><button title="View PDF" onClick={() => viewPDF(doc.pdfBase64)}><Eye/></button><button title="Download PDF" onClick={() => openPDF(doc.pdfBase64, doc.title)}><Download/></button></div></article>)}
          {!visibleSeedDocs.length && !visibleSavedDocs.length && <div className="lk-repository-empty">No documents match this search.</div>}
        </div>}
        <div className="lk-repository-browser-footer"><span>Showing {visibleSeedDocs.length + visibleSavedDocs.length} matching documents · Original collection remains unchanged</span><button onClick={() => onNavigate(32)}>Create Manual Entry <ClipboardPenLine/></button></div>
      </section>
      <footer className="lk-repository-page-footer"><span>TOYOTA INNOVA <b>·</b> REAR SUSPENSION <b>·</b> {component.name.toUpperCase()}</span><button onClick={() => onNavigate(13)}>Return to Component Workspace <ArrowRight/></button></footer>
    </div>
  </main>;
};
