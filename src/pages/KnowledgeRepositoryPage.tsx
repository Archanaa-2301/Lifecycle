import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  GitBranch,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  Eye,
} from 'lucide-react';
import type { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';
import {
  openPDF,
  readRepositoryPDFs,
  syncRepositoryPDFs,
  viewPDF,
  type RepositoryName,
  type RepositoryPDF,
} from '../utils/repositoryStore';
import { runSelectionFlight } from '../utils/selectionMotion';

interface Props {
  componentIndex: number;
  onNavigate: (page: PageId) => void;
  backPage?: PageId;
}

type RepositoryArea = {
  id: RepositoryName;
  number: string;
  shortTitle: string;
  title: string;
  description: string;
  icon: React.ElementType;
  groups: string[];
};

const repositoryAreas: RepositoryArea[] = [
  {
    id: 'Know-How',
    number: '01',
    shortTitle: 'Know-How',
    title: 'Know-How Repository',
    description: 'Technical product knowledge, design guidance, materials, manufacturing, validation and lessons learned.',
    icon: BookOpen,
    groups: ['Functional design', 'Requirements & design inputs', 'Geometry & interfaces', 'Materials & manufacturing', 'Validation & testing', 'Lessons learned'],
  },
  {
    id: 'Project Management',
    number: '02',
    shortTitle: 'Project Management',
    title: 'Project Management Repository',
    description: 'Project RFIs, RFQs, customer requirements, milestones, meeting minutes, actions and decisions.',
    icon: BriefcaseBusiness,
    groups: ['Request for Information (RFI)', 'Request for Quotation (RFQ)', 'Customer requirements', 'Schedule & milestones', 'Meeting minutes', 'Action & decision register', 'Supplier assessment', 'Project risk & issue register'],
  },
  {
    id: 'Change Management',
    number: '03',
    shortTitle: 'Change Management',
    title: 'Change Management Repository',
    description: 'Engineering change requests, drawing revisions, impact assessments, approvals and implementation records.',
    icon: GitBranch,
    groups: ['Engineering Change Request (ECR)', 'Drawing revision & release', 'Material / compound change', 'Geometry modification', 'Tolerance change assessment', 'Interface change impact', 'Change review & approval', 'Implementation verification', 'Configuration history'],
  },
  {
    id: 'Warranty / Field Return / Failure',
    number: '04',
    shortTitle: 'Warranty / Failure',
    title: 'Warranty / Field Return / Failure Repository',
    description: 'Field complaints, warranty assessments, returned-part evidence, failure investigations, root cause and corrective actions.',
    icon: ShieldCheck,
    groups: ['Field complaint intake', 'Warranty claim assessment', 'Field failure investigation', 'Permanent set / deformation analysis', 'Crack / tear investigation', 'Material ageing & degradation', 'Root cause analysis (RCA)', 'Containment & corrective action', 'Effectiveness verification', 'Field trend & recurrence review'],
  },
];

function getInitialRepository(): RepositoryName {
  const stored = localStorage.getItem('lifex-selected-repository');
  return repositoryAreas.some((area) => area.id === stored)
    ? (stored as RepositoryName)
    : 'Know-How';
}

export const KnowledgeRepositoryPage: React.FC<Props> = ({
  componentIndex,
  onNavigate,
  backPage = 13,
}) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];
  const [activeRepository, setActiveRepository] = useState<RepositoryName>(getInitialRepository);
  const chooseRepository = (id: RepositoryName, source: HTMLButtonElement) => {
    if (repositorySelecting) return;
    setRepositorySelecting(true);
    const area = repositoryAreas.find(item => item.id === id);
    runSelectionFlight(source, { title: area?.shortTitle || id, subtitle: 'REPOSITORY SELECTED', imageSrc: '/lifex-logo.png', targetElement: document.querySelector<HTMLElement>('.knowledge-repository-content'), duration: 880, onComplete: () => { setActiveRepository(id); setRepositorySelecting(false); } });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [repositorySelecting, setRepositorySelecting] = useState(false);
  const [storedPdfs, setStoredPdfs] = useState<RepositoryPDF[]>(readRepositoryPDFs);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    let mounted = true;
    const refreshFromCache = () => {
      if (mounted) setStoredPdfs(readRepositoryPDFs());
    };
    const load = async () => {
      setLoading(true);
      try {
        const records = await syncRepositoryPDFs();
        if (mounted) {
          setStoredPdfs(records);
          setSyncError('');
        }
      } catch {
        if (mounted) setSyncError('Could not connect to the repository service. Showing locally cached records, if available.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    window.addEventListener('lifex-repository-updated', refreshFromCache);
    window.addEventListener('storage', refreshFromCache);
    void load();
    return () => {
      mounted = false;
      window.removeEventListener('lifex-repository-updated', refreshFromCache);
      window.removeEventListener('storage', refreshFromCache);
    };
  }, []);

  const activeArea = repositoryAreas.find((area) => area.id === activeRepository) || repositoryAreas[0];
  const ActiveIcon = activeArea.icon;

  useEffect(() => {
    localStorage.setItem('lifex-selected-repository', activeRepository);
    setSearchQuery('');
  }, [activeRepository]);

  const savedDocuments = useMemo(() => {
    const componentKey = `${part.name} (RB-001)`;
    return storedPdfs.filter((doc) => {
      if (doc.repository !== activeRepository) return false;
      if (doc.component && doc.component !== componentKey) return false;
      const haystack = `${doc.id || ''} ${doc.title || ''} ${doc.sourceType || ''} ${doc.sourceDate || ''} ${doc.savedAt || ''}`.toLowerCase();
      return haystack.includes(searchQuery.toLowerCase());
    });
  }, [storedPdfs, activeRepository, part.name, searchQuery]);

  const referenceDocuments = useMemo(() => {
    if (activeRepository !== 'Know-How') return [];
    return (part.documents || []).filter((doc) =>
      `${doc.title} ${doc.type} ${doc.relevance}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeRepository, part.documents, searchQuery]);

  const repositoryCounts = useMemo(() => {
    const componentKey = `${part.name} (RB-001)`;
    return repositoryAreas.map((area) => ({
      id: area.id,
      count: storedPdfs.filter((doc) =>
        doc.repository === area.id && (!doc.component || doc.component === componentKey)
      ).length + (area.id === 'Know-How' ? (part.documents || []).length : 0),
    }));
  }, [storedPdfs, part.name, part.documents]);

  return (
    <main className="min-h-[calc(100vh-58px)] overflow-x-hidden bg-[#020b12] px-4 py-5 text-slate-100 sm:px-6 lg:px-8 lifex-page-enter">
      <div className="mx-auto max-w-[1580px]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-950/80 pb-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">
              <span>Rear Suspension</span>
              <span className="text-slate-600">/</span>
              <span>{part.name}</span>
              <span className="text-slate-600">/</span>
              <span>Knowledge Repository</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {part.name} Knowledge Repository
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Browse the original repository forms and saved engineering records for this component.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(backPage)}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-900/70 bg-[#081723] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {backPage === 29 ? 'Back to Global Repository' : `Back to ${part.name} Workspace`}
          </button>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {repositoryAreas.map((area, index) => {
            const Icon = area.icon;
            const selected = activeRepository === area.id;
            const count = repositoryCounts.find((item) => item.id === area.id)?.count || 0;
            return (
              <button
                type="button"
                key={area.id}
                onClick={(event) => chooseRepository(area.id, event.currentTarget)} disabled={repositorySelecting} aria-pressed={selected}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? 'border-cyan-400/80 bg-gradient-to-br from-[#0a3546] to-[#06202d] shadow-[0_0_25px_rgba(0,205,225,.10)]'
                    : 'border-cyan-950/80 bg-[#061723] hover:border-cyan-700/80 hover:bg-[#082131]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? 'bg-cyan-400/15 text-cyan-300' : 'bg-slate-900 text-slate-400'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold tracking-[.14em] text-cyan-400">0{index + 1}</span>
                </div>
                <h2 className="mt-3 text-sm font-bold text-white">{area.shortTitle}</h2>
                <p className="mt-1 text-[10px] text-slate-400">{count} saved forms / records</p>
              </button>
            );
          })}
        </section>

        <section className="knowledge-repository-content grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-cyan-900/60 bg-[#061723] p-3">
            <div className="px-3 pb-3 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-400">Repository structure</p>
              <p className="mt-1 text-xs text-slate-500">{activeArea.shortTitle}</p>
            </div>
            <div className="space-y-2">
              {activeArea.groups.map((group, index) => (
                <div key={group} className="flex items-center gap-3 rounded-lg border border-cyan-950/80 bg-[#04121c] px-3 py-2.5">
                  <span className="text-[9px] font-bold text-cyan-500">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-300">{group}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-w-0 rounded-2xl border border-cyan-900/60 bg-gradient-to-br from-[#061a27] to-[#03111b] p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cyan-950/80 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-700/70 bg-cyan-950/50 text-cyan-300">
                  <ActiveIcon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-400">
                    Repository {activeArea.number}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">{activeArea.title}</h2>
                  <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">{activeArea.description}</p>
                </div>
              </div>
              <span className="rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1.5 text-[10px] font-semibold text-cyan-300">
                {savedDocuments.length} SAVED FORMS
              </span>
            </div>

            <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={`Search ${activeArea.shortTitle} forms...`}
                  className="h-11 w-full rounded-xl border border-cyan-900/70 bg-[#03111b] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>
              <div className="flex h-11 items-center gap-2 rounded-xl border border-cyan-900/70 bg-[#03111b] px-3 text-xs text-slate-400">
                <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
                Component: <span className="font-semibold text-slate-200">{part.name}</span>
              </div>
            </div>

            {syncError && (
              <div className="mb-4 rounded-lg border border-amber-800/70 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
                {syncError}
              </div>
            )}

            {loading && (
              <div className="mb-4 text-xs text-slate-500">Loading saved repository forms...</div>
            )}

            {activeRepository === 'Know-How' && referenceDocuments.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[.14em] text-slate-300">Component reference forms</h3>
                    <p className="mt-1 text-[10px] text-slate-500">Reference entries defined for {part.name}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{referenceDocuments.length} reference items</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {referenceDocuments.map((doc, index) => (
                    <article key={`${doc.title}-${index}`} className="rounded-xl border border-cyan-950/90 bg-[#04131e] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{doc.title}</p>
                          <p className="mt-1 text-[10px] text-cyan-400">{doc.type}</p>
                          <p className="mt-2 text-xs leading-5 text-slate-400">{doc.relevance}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-amber-800/60 bg-amber-950/30 px-2 py-1 text-[9px] text-amber-300">
                          {doc.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[.14em] text-slate-300">Saved repository forms</h3>
              <span className="text-[10px] text-slate-500">{savedDocuments.length} PDF records</span>
            </div>

            {savedDocuments.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {savedDocuments.map((doc) => (
                  <article key={doc.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#17485a] bg-[#03131d] p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-900/70 bg-cyan-950/40 text-cyan-300">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">{doc.title}</p>
                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {doc.id} · {doc.sourceType || 'Repository Form'} · {doc.sourceDate || doc.savedAt || 'Imported record'}
                      </p>
                    </div>
                    <button
                      type="button"
                      title="View PDF"
                      onClick={() => viewPDF(doc.pdfUrl || doc.pdfBase64)}
                      className="rounded-lg border border-cyan-800 p-2 text-cyan-200 transition hover:bg-cyan-900/40"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Download PDF"
                      onClick={() => openPDF(doc.pdfUrl || doc.pdfBase64, doc.title)}
                      className="rounded-lg border border-cyan-800 p-2 text-cyan-200 transition hover:bg-cyan-900/40"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-cyan-900/70 bg-[#04131e] px-5 py-10 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-600" />
                <h4 className="mt-3 text-sm font-semibold text-white">
                  {loading ? 'Checking repository records' : 'No saved forms found in this repository'}
                </h4>
                <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  {loading
                    ? 'The repository records are being loaded from the LIFEX API.'
                    : 'The repository page is connected to /api/reports. If your forms were imported before, check that the LIFEX backend is running and that the repository-data folder is still present.'}
                </p>
              </div>
            )}
          </section>
        </section>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-cyan-950/80 bg-[#04131d] px-4 py-3 text-[10px] text-slate-400">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-300" />
          Repository forms remain stored by the LIFEX server; selecting another repository only changes this view.
        </div>
      </div>
    </main>
  );
};

export default KnowledgeRepositoryPage;
