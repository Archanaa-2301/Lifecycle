import React from 'react';
import { PageId, LifecycleDoc } from '../types/lifex';
import { LIFECYCLE_DOCS } from '../data/lifexData';
import { COMPONENTS } from './componentKnowledge';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';

interface LifecycleDocumentsPageProps {
  componentIndex: number;
  onNavigate: (page: PageId) => void;
  onSelectDoc?: (doc: LifecycleDoc) => void;
}

const getRelevance = (
  code: string,
  componentName: string,
  engineering: string[],
  checks: string[],
  interfaces: string[],
) => {
  switch (code) {
    case 'RFI':
      return `Clarify ${componentName} functional requirements, vehicle application assumptions and interfaces: ${interfaces.join('; ')}.`;
    case 'RFQ':
      return `Use the ${componentName} requirements to request supplier pricing, process capability, tooling assumptions and lead-time information. Confirm the applicable material and manufacturing route.`;
    case 'Development':
      return `Capture the ${componentName} design definition. Key design topics: ${engineering.join('; ')}. Link the released 3D model, 2D drawing, GD&T and engineering change history.`;
    case 'DV':
      return `Plan design verification for ${componentName} against these checks: ${checks.join('; ')}. Add approved methods, sample sizes and acceptance criteria.`;
    case 'PV':
      return `Validate that production-intent ${componentName} parts and processes meet the released design. Include fit, assembly, process and dimensional evidence relevant to the application.`;
    case 'PP':
      return `Compile the ${componentName} PPAP evidence: dimensional results, material and performance tests, process flow, control plan, capability and PSW as applicable.`;
    case 'SOP':
      return `Capture ${componentName} production readiness, approved plant revision, work instructions, control-plan deployment and launch actions.`;
    case 'Warranty':
      return `Record field symptoms and failure evidence for ${componentName}. Structure containment, root-cause investigation and corrective actions around: ${checks.join('; ')}.`;
    default:
      return `Lifecycle information relevant to ${componentName}.`;
  }
};

const documentDescriptions: Record<string, string> = {
  RFI: 'Request For Information · Engineering questions and technical clarification',
  RFQ: 'Request For Quotation · Supplier, costing and sourcing information',
  Development: 'Design Engineering · Design definition, drawings and engineering changes',
  DV: 'Design Validation · Verification methods, test evidence and results',
  PV: 'Production Validation · Production-intent parts and process validation',
  PP: 'Production Part Approval · PPAP evidence and submission documentation',
  SOP: 'Start of Production · Manufacturing readiness and launch information',
  Warranty: 'Field Failure Analysis · Field concerns, investigation and corrective action',
};

export const LifecycleDocumentsPage: React.FC<LifecycleDocumentsPageProps> = ({
  componentIndex,
  onNavigate,
  onSelectDoc,
}) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];

  const handleSelect = (doc: LifecycleDoc) => {
    onSelectDoc?.(doc);
    onNavigate(16);
  };

  return (
    <main className="min-h-screen bg-[#020b12] px-4 py-6 text-slate-100 sm:px-6 lg:px-7 lifex-page-enter">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-col gap-4 border-b border-[#103242] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">
              Manual Entry / Lifecycle Document Library
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Lifecycle Documents
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Choose an engineering document for {part.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(13)}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#07566a] bg-[#061722] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-[#00cfe3] hover:bg-[#092432] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Component Workspace
          </button>
        </header>

        <section className="mb-6 flex items-center gap-3 rounded-xl border border-[#07566a]/70 bg-[#061722] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#07566a] bg-[#03131c] text-cyan-400">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[.16em] text-cyan-400">
              Selected Engineering Component
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-white">{part.name}</h2>
            <p className="mt-0.5 text-xs text-[#8faFC4]">
              Select one of the eight document types to continue.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LIFECYCLE_DOCS.map((doc, index) => {
            const relevance = getRelevance(
              doc.code,
              part.name,
              part.engineering || [],
              part.checks || [],
              part.interfaces || [],
            );
            const description = documentDescriptions[doc.code] || doc.subtext;

            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleSelect(doc)}
                style={{ animationDelay: `${index * 55}ms` }}
                className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-[#07566a]/65 bg-gradient-to-b from-[#061925] to-[#03131c] p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#00cfe3] hover:bg-[#092432] hover:shadow-[0_14px_32px_rgba(0,190,220,.10)] focus:outline-none focus:ring-2 focus:ring-cyan-400/70 active:translate-y-0 active:scale-[.99]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-300 group-hover:via-cyan-300/80" />
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#07566a]/80 bg-[#03131c] text-cyan-400 transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/80 group-hover:bg-[#073040]">
                    <FileText className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#5d8799]">
                    Open document
                  </span>
                </div>

                <div className="font-mono text-2xl font-bold tracking-wide text-white transition-colors duration-200 group-hover:text-cyan-300">
                  {doc.code}
                </div>
                <h3 className="mt-1 text-sm font-semibold leading-5 text-cyan-300">
                  {doc.name}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#a7bdca]">
                  {description}
                </p>
                <div className="mt-4 rounded-lg border border-[#07566a]/45 bg-[#020e16]/70 p-3">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[.13em] text-[#37c6d6]">
                    {part.name} · Engineering context
                  </p>
                  <p className="line-clamp-3 text-[10px] leading-[1.55] text-slate-400">
                    {relevance}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-[#07566a]/45 pt-4 mt-4 text-[10px] font-bold uppercase tracking-[.1em] text-cyan-300">
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default LifecycleDocumentsPage;
