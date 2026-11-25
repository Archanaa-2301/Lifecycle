import './lifex-dashboard-light-overrides.css';
import './lifex-dashboard-effects.css';
import './lifex-dashboard-route.css';
import React, { useState } from 'react';
import type { PageId } from '../types/lifex';
import {
  Home,
  BookOpen,
  BriefcaseBusiness,
  GitBranch,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Car,
  ClipboardList,
  ChevronRight,
  Layers3,
} from 'lucide-react';

type Section = 'home' | 'knowledge' | 'project' | 'change' | 'warranty';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

const navigation: {
  id: Section;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: 'home', label: 'Home', icon: Home },
];

const repositories = [
  {
    id: 'knowledge' as Section,
    number: '01',
    title: 'Knowledge Management',
    description: 'Capture and connect engineering knowledge across the vehicle lifecycle.',
    detail: 'Technical · Project · Customer · Competition · Process Know-How',
    icon: BookOpen,
  },
  {
    id: 'project' as Section,
    number: '02',
    title: 'Project Management',
    description: 'Organise engineering activities, milestones and project decisions.',
    detail: 'Project workspace · Action register',
    icon: BriefcaseBusiness,
  },
  {
    id: 'change' as Section,
    number: '03',
    title: 'Change Management',
    description: 'Track design changes, reviews, approvals and their impact.',
    detail: 'Change requests · Impact · Approvals',
    icon: GitBranch,
  },
  {
    id: 'warranty' as Section,
    number: '04',
    title: 'Warranty / Failure',
    description: 'Connect field issues and failure insights with engineering knowledge.',
    detail: 'Warranty records · Field returns · Failure analysis',
    icon: ShieldCheck,
  },
];

const sectionContent: Record<
  Exclude<Section, 'home'>,
  { eyebrow: string; title: string; description: string; items: string[]; action: string }
> = {
  knowledge: {
    eyebrow: 'ENGINEERING KNOWLEDGE REPOSITORY',
    title: 'Knowledge Management',
    description:
      'Build a connected engineering knowledge base. Select a knowledge domain to explore its repository.',
    items: [
      'Technical Product Know-How',
      'Project Know-How',
      'Customer Know-How',
      'Competition Know-How',
      'Process Know-How',
    ],
    action: 'Explore Repositories',
  },
  project: {
    eyebrow: 'PROJECT WORKSPACE',
    title: 'Project Management',
    description:
      'Keep engineering project information, milestones and follow-up actions organised in one place.',
    items: ['Project overview', 'Milestones and deliverables', 'Action register', 'Meeting minutes'],
    action: 'Open project workspace',
  },
  change: {
    eyebrow: 'ENGINEERING CHANGE WORKSPACE',
    title: 'Change Management',
    description:
      'Review engineering changes and maintain visibility of decisions, approvals and affected components.',
    items: ['Change requests', 'Design impact assessment', 'Review and approval', 'Change history'],
    action: 'Open change workspace',
  },
  warranty: {
    eyebrow: 'FIELD QUALITY REPOSITORY',
    title: 'Warranty / Failure',
    description:
      'Bring warranty observations, field returns and failure investigations into the engineering knowledge loop.',
    items: ['Warranty records', 'Field return cases', 'Failure analysis', 'Corrective actions'],
    action: 'Open warranty repository',
  },
};

function VehicleWireframe() {
  return (
    <div className="relative overflow-hidden">
      <img
        src="/lifex-dashboard-sedan.webp"
        alt="Detailed cyan automotive wireframe sedan"
        className="lifex-car-image relative z-10 h-auto w-full object-contain"
      />
    </div>
  );
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [section, setSection] = useState<Section>('home');
  const [search, setSearch] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  const handleExploreVehicleKnowledge = () => {
    onNavigate(27 as PageId);
  };

  const navigateSection = (next: Section) => {
    if (next === section) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setSection(next);
      setTransitioning(false);
    }, 140);
  };

  const openSection = (next: Section) => navigateSection(next);

  const filteredRepositories = repositories.filter((item) =>
    `${item.title} ${item.description} ${item.detail}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="lifex-dashboard lifex-dashboard-light min-h-screen overflow-x-hidden px-4 pb-10 pt-0 sm:px-7">
      <header className="lifex-dashboard-brandbar">
        <a className="lifex-dashboard-brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate(1); }}>
          <img src="/lifex-logo.png" alt="LIFEX — Lifecycle Intelligence For Engineering Excellence" />
          <span className="lifex-dashboard-brand-divider" />
          <span>Lifecycle Intelligence For Engineering Excellence</span>
        </a>
        <div className="lifex-dashboard-user">
          <span className="lifex-dashboard-user-dot" />
          <span>Engineering Workspace</span>
          <button type="button" className="lifex-dashboard-top-action" onClick={() => onNavigate(1)}>Home</button>
          <button type="button" className="lifex-dashboard-top-action lifex-dashboard-signout" onClick={() => onNavigate(3)}>Sign out</button>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] pt-5">
        <div className="mb-3 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/35 px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {section === 'home' ? 'ENGINEERING DASHBOARD' : sectionContent[section].eyebrow}
          </div>
        </div>

        {/* One integrated dashboard panel */}
        <section className="lifex-panel overflow-hidden rounded-2xl border border-cyan-900/70 bg-[#071723] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="grid min-h-[590px] grid-cols-1 lg:grid-cols-[228px_minmax(0,1fr)]">
            {/* Navigation stays inside the panel */}
            <aside className="lifex-sidebar border-b border-cyan-950/80 bg-[#06131e] p-4 lg:border-b-0 lg:border-r lg:p-5">
              <div className="mb-5 px-2 pt-1">
                <div className="text-[9px] font-semibold tracking-[0.22em] text-slate-600">WORKSPACE</div>
                <div className="mt-1 text-xs text-slate-400">Navigate repositories</div>
              </div>
              <nav className="space-y-1">
                {navigation.map(({ id, label, icon: Icon }) => {
                  const active = section === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => navigateSection(id)}
                      className={`lifex-nav-link group flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-[12px] font-semibold ${active ? 'is-active' : ''} ${
                        active
                          ? 'border-cyan-700/60 bg-cyan-950/55 text-cyan-200 shadow-[inset_2px_0_0_#22d3ee,0_0_18px_rgba(6,182,212,0.07)]'
                          : 'border-transparent text-slate-400 hover:translate-x-0.5 hover:border-cyan-900/70 hover:bg-[#0a202d] hover:text-slate-100'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-300'}`} />
                      <span className="flex-1">{label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />}
                    </button>
                  );
                })}
              </nav>
              <button
                type="button"
                onClick={() => onNavigate(27 as PageId)}
                className="lifex-explore-sidebar-link mt-4 flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-[12px] font-semibold transition-all"
              >
                <Layers3 className="h-4 w-4 shrink-0" />
                <span className="flex-1">Explore Repositories</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </aside>

            <div className={`lifex-content-transition min-w-0 p-5 sm:p-7 lg:p-8 ${transitioning ? 'translate-y-1 opacity-0 blur-[2px]' : 'translate-y-0 scale-100 opacity-100 blur-0'}`}>
              {section === 'home' ? (
                <>
                  {/* Welcome / hero */}
                  <div className="grid items-center gap-5 border-b border-cyan-950/80 pb-7 md:grid-cols-[1.05fr_0.95fr]">
                    <div className="lifex-hero-copy">
                      <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold tracking-[0.2em] text-teal-400">
                        <span className="lifex-accent-line h-px w-6 bg-teal-400" />
                        WELCOME TO LIFEX
                      </div>
                      <h1 className="max-w-xl text-[32px] font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-[42px] xl:text-[46px]">
                        Engineering knowledge,
                        <span className="block text-blue-600">connected for decisions.</span>
                      </h1>
                      <p className="mt-4 max-w-lg text-[13px] leading-7 text-slate-600 sm:text-sm">
                        A unified intelligence workspace connecting product knowledge, engineering programmes,
                        design changes and field quality across the vehicle lifecycle.
                      </p>
                      <button
                        type="button"
                        onClick={handleExploreVehicleKnowledge}
                        className="lifex-cta mt-5 inline-flex items-center gap-2 rounded-md border border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 text-[10px] font-semibold tracking-wide text-cyan-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_8px_24px_rgba(6,182,212,0.12)] active:translate-y-0"
                      >
                        Explore Repositories <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="lifex-car-frame relative mx-auto w-full max-w-[590px]">
                      <div className="pointer-events-none absolute inset-8 rounded-full bg-cyan-500/10 blur-3xl" />
                      <div className="relative rounded-xl border border-cyan-900/50 bg-[#06131e]/80 px-2 py-4">
                        <div className="mb-1 flex items-center justify-between px-3 text-[8px] tracking-[0.18em] text-slate-600">
                          <span>VEHICLE SYSTEMS / DESIGN INTELLIGENCE</span>
                          <span className="text-teal-500">LXF—01</span>
                        </div>
                        <VehicleWireframe />
                        <div className="flex items-center justify-between px-3 text-[8px] tracking-[0.14em] text-slate-600">
                          <span>CONNECTED ENGINEERING DATA</span>
                          <span>01 / 04</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Four repository cards */}
                  <div className="pt-6">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <div className="text-[9px] font-semibold tracking-[0.2em] text-blue-600">LIFECYCLE REPOSITORIES</div>
                        <h2 className="mt-1 text-base font-semibold text-slate-900">Explore your workspace</h2>
                      </div>
                      <div className="text-[9px] text-slate-500">SELECT A REPOSITORY TO CONTINUE</div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {repositories.map(({ id, number, title, description, detail, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => openSection(id)}
                          className="lifex-repository-card group relative flex min-h-[190px] flex-col rounded-xl border border-cyan-950 bg-[#091c29] p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/60 hover:bg-[#0b2331] hover:shadow-[0_12px_30px_rgba(6,182,212,0.09)] active:translate-y-0"
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="font-mono text-[9px] tracking-[0.15em] text-slate-600">{number} / 04</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-900/70 bg-cyan-950/60 text-cyan-300 transition-colors group-hover:border-cyan-500/50 group-hover:bg-cyan-900/50">
                              <Icon className="h-4 w-4" />
                            </span>
                          </div>
                          <h3 className="mt-4 text-[16px] font-bold text-white transition-colors group-hover:text-cyan-200">{title}</h3>
                          <p className="mt-2 text-[13px] leading-[1.65] text-slate-300">{description}</p>
                          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                            <span className="line-clamp-1 text-[9px] text-slate-400">{detail}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cyan-700 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <section className="mx-auto max-w-4xl py-2">
                  <button
                    type="button"
                    onClick={() => navigateSection('home')}
                    className="mb-7 inline-flex items-center gap-2 text-[10px] font-medium text-slate-500 transition-colors hover:text-cyan-300"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
                  </button>
                  <div className="mb-3 text-[9px] font-semibold tracking-[0.2em] text-teal-400">
                    {sectionContent[section].eyebrow}
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {sectionContent[section].title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-400">
                    {sectionContent[section].description}
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {sectionContent[section].items.map((item, index) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => section === 'knowledge' && index === 0 && onNavigate(5 as PageId)}
                        className="group flex items-center gap-3 rounded-xl border border-cyan-950 bg-[#091c29] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-600/60 hover:bg-[#0b2331]"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-900/70 bg-cyan-950/50 text-cyan-300">
                          {section === 'knowledge' ? <BookOpen className="h-4 w-4" /> : section === 'project' ? <ClipboardList className="h-4 w-4" /> : section === 'change' ? <GitBranch className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-slate-200 group-hover:text-cyan-200">{item}</span>
                          <span className="mt-1 block text-[9px] text-slate-600">
                            {section === 'knowledge' && index === 0 ? 'Browse vehicle and component knowledge' : 'Repository area'}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />
                      </button>
                    ))}
                  </div>
                  {section === 'knowledge' && (
                    <div className="mt-8 rounded-xl border border-teal-900/60 bg-teal-950/20 p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-teal-200">
                        <Car className="h-4 w-4" /> Current proof of concept
                      </div>
                      <p className="mt-2 text-[11px] leading-5 text-slate-400">
                        Rear Shock Absorber · Ford Titanium · Rear Suspension. Open Technical Product Know-How to
                        continue into the vehicle repository.
                      </p>
                      <button
                        type="button"
                        onClick={() => onNavigate(5 as PageId)}
                        className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
                      >
                        Open vehicle selection <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-1 pt-4 text-[8px] tracking-[0.12em] text-slate-700">
          <span>LIFEX · ENGINEERING INTELLIGENCE</span>
          <span>REAR SHOCK ABSORBER POC</span>
        </footer>
      </main>


    </div>
  );
};
