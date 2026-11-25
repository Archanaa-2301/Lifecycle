import './lifex-engineering-repository.css';
import React, { useState } from 'react';
import {
  ArrowRight, Bell, BookOpen, ChevronDown, FileText, FlaskConical,
  Folder, Globe2, Lightbulb, Moon, RefreshCw, Search, ShieldCheck, Sun,
} from 'lucide-react';
import type { PageId } from '../types/lifex';

type Theme = 'dark' | 'light';
interface Props {
  onNavigate: (page: PageId) => void;
  /** Pass the app-wide theme here to keep this screen synchronized with the rest of LIFEX. */
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

const globalCategories = [
  { label: 'Design Rules', icon: BookOpen },
  { label: 'Templates', icon: FileText },
  { label: 'Processes', icon: RefreshCw },
];

const projectCategories = [
  { label: 'Design Documents', icon: FileText },
  { label: 'Test Reports', icon: FlaskConical },
  { label: 'Change History', icon: RefreshCw },
  { label: 'Failure & Warranty', icon: ShieldCheck },
  { label: 'Lessons Learned', icon: Lightbulb },
];

export const EngineeringRepositoryPage: React.FC<Props> = ({ onNavigate, theme: controlledTheme, onThemeChange }) => {
  const [localTheme, setLocalTheme] = useState<Theme>('light');
  const theme = controlledTheme ?? localTheme;
  const dark = theme === 'dark';
  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    onThemeChange ? onThemeChange(next) : setLocalTheme(next);
  };
  const chooseRepository = (kind: 'global' | 'project') => {
    onNavigate(kind === 'global' ? 29 : 35);
  };

  const colors = dark ? {
    page: 'bg-[#061521] text-slate-100', header: 'border-cyan-900/70 bg-[#06131e]/95', sidebar: 'border-cyan-900/70 bg-[#06131e]',
    muted: 'text-slate-400', body: 'text-slate-300', card: 'border-cyan-500/80 bg-[radial-gradient(ellipse_at_50%_42%,rgba(0,156,190,.15),transparent_65%),linear-gradient(145deg,#082536,#061723_62%,#071b28)] shadow-[0_0_28px_rgba(6,182,212,.09)]',
    image: 'bg-[#041722]/35', chip: 'border-cyan-700/80 bg-[#06202d]/90 text-slate-200', footer: 'border-cyan-900/70 bg-[#06131e] text-slate-400',
    nav: 'text-slate-300 hover:border-cyan-900/70 hover:bg-[#0a202d] hover:text-white', active: 'border-cyan-500/70 bg-cyan-950/55 text-cyan-200',
    icon: 'border-cyan-400 bg-[#062331]/95 text-cyan-300', outline: 'border-cyan-400 text-cyan-300 hover:bg-cyan-950/50', input: 'border-cyan-800/80 bg-[#04121c] text-slate-100 placeholder:text-slate-500',
    callout: 'border-cyan-800/70 bg-[#08202d] text-cyan-300',
  } : {
    page: 'bg-[#f3f8fc] text-[#0b1b32]', header: 'border-slate-200 bg-white/95', sidebar: 'border-slate-200 bg-white',
    muted: 'text-slate-500', body: 'text-slate-600', card: 'border-cyan-500/70 bg-[radial-gradient(ellipse_at_50%_42%,rgba(0,190,215,.10),transparent_65%),linear-gradient(145deg,#ffffff,#f2f8fc_62%,#eaf5fa)] shadow-[0_8px_28px_rgba(15,68,94,.08)]',
    image: 'bg-white/45', chip: 'border-cyan-200 bg-white/90 text-slate-700', footer: 'border-slate-200 bg-white text-slate-500',
    nav: 'text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-slate-900', active: 'border-cyan-300 bg-cyan-100 text-cyan-900',
    icon: 'border-cyan-500 bg-white text-cyan-700', outline: 'border-cyan-600 text-cyan-700 hover:bg-cyan-50', input: 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400',
    callout: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  };

  return <div className={`lifex-engineering-repository min-h-screen overflow-x-hidden ${dark ? 'is-dark' : 'is-light'} ${colors.page}`}>
    <header className={`sticky top-0 z-40 flex h-[76px] items-center gap-4 border-b px-5 backdrop-blur-xl sm:px-8 ${colors.header}`}>
      <div className="hidden w-[215px] shrink-0 lg:block" />
      <div className="relative mx-auto flex w-full max-w-[760px] items-center">
        <Search className={`pointer-events-none absolute left-4 h-4 w-4 ${colors.muted}`} />
        <input aria-label="Search LIFEX" placeholder="Search repositories, documents, components..." className={`h-11 w-full rounded-xl border pl-11 pr-4 text-sm outline-none focus:border-cyan-400 ${colors.input}`} />
      </div>
      <button type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'white' : 'dark'} mode`} className={`rounded-lg border p-2 transition ${dark ? 'border-cyan-900 text-cyan-200 hover:bg-cyan-950/60' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}>{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
      <button type="button" aria-label="Notifications" className={`relative hidden rounded-lg p-2 sm:block ${colors.muted}`}><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-400" /></button>
      <div className={`hidden items-center gap-3 border-l pl-5 sm:flex ${dark ? 'border-cyan-900/70' : 'border-slate-200'}`}><div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">A</div><ChevronDown className={`h-4 w-4 ${colors.muted}`} /></div>
    </header>

    <div className="grid min-h-[calc(100vh-76px)] grid-cols-1 lg:grid-cols-[244px_minmax(0,1fr)]">
      <aside className={`flex flex-col border-b px-4 py-6 lg:border-b-0 lg:border-r ${colors.sidebar} ${dark ? 'border-cyan-900/70' : 'border-slate-200'}`}>
        <div className="mb-7 px-3"><img src="/lifex-logo.png" alt="LIFEX – Lifecycle Intelligence For Engineering Excellence" className="h-auto w-[150px] object-contain" /></div>
        <nav className="space-y-2">
          <button type="button" onClick={() => onNavigate(4)} className={`flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-sm transition ${colors.nav}`}><BookOpen className="h-5 w-5" /> Dashboard</button>
          <div className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold ${colors.active}`}><Globe2 className="h-5 w-5" /> Engineering Repository<span className="ml-auto h-2 w-2 rounded-full bg-cyan-400" /></div>
        </nav>
        <div className="mt-auto pt-8"><div className={`flex items-center gap-3 rounded-xl border p-4 ${colors.callout}`}><Lightbulb className="h-8 w-8 shrink-0 text-cyan-500" /><div className="text-[11px] leading-4">Turning Engineering Knowledge into Smarter Decisions</div></div></div>
      </aside>

      <main className="min-w-0 px-5 py-6 sm:px-7 lg:px-9">
        <div className="mb-5 flex items-center justify-between gap-3"><div className={`flex items-center gap-2 text-xs ${colors.muted}`}><button type="button" onClick={() => onNavigate(4)} className="transition hover:text-cyan-500">Home</button><span>/</span><span className="font-medium text-cyan-600">Engineering Repository</span></div><div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold tracking-[0.18em] ${dark ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300' : 'border-cyan-300 bg-cyan-50 text-cyan-800'}`}><span className="h-2 w-2 rounded-full bg-cyan-400" /> ENGINEERING REPOSITORY</div></div>
        <section className="mb-6"><h1 className={`text-3xl font-bold tracking-tight sm:text-[42px] ${dark ? 'text-white' : 'text-[#0b1b32]'}`}>Engineering <span className="text-cyan-500">Repository</span></h1><p className={`mt-2 max-w-3xl text-sm sm:text-base ${colors.body}`}>Choose how you want to access engineering knowledge in LIFEX.</p></section>

        <div className="mb-3 flex items-center justify-between gap-3">
          <span className={`text-[10px] font-extrabold tracking-[0.2em] ${dark ? 'text-cyan-300' : 'text-blue-700'}`}>LIFECYCLE KNOWLEDGE SPACES</span>
          <span className={`hidden text-[11px] sm:block ${colors.muted}`}>Choose a repository to continue</span>
        </div>
        
        <section className="lifex-repository-grid grid items-stretch gap-5 2xl:grid-cols-2">
          {/* GLOBAL REPOSITORY: statistics removed as requested. */}
          <article role="button" tabIndex={0} aria-label="Select Global Repository" onClick={() => chooseRepository('global')} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseRepository('global'); } }} className={`repo-choice-card flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6 ${colors.card}`}>
            <div className="flex items-start gap-4"><Globe2 className="mt-1 h-14 w-14 shrink-0 text-cyan-500" strokeWidth={1.4} /><div><h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-[#0b1b32]'}`}>Global Repository</h2><p className={`mt-1 max-w-md text-sm leading-5 ${colors.body}`}>Access reusable engineering knowledge, design practices, validated solutions and lessons learned across all vehicle programs.</p></div></div>
            <div className={`my-5 h-[230px] overflow-hidden rounded-xl border ${dark ? 'border-cyan-900/70' : 'border-blue-100'} ${colors.image}`}>
              <img src="/lifex-global-repository-globe.png" alt="Digital globe with connected engineering knowledge, shared data and global standards" className="h-full w-full object-cover transition duration-500 hover:scale-[1.025]" />
            </div>
            <div className="mb-5 space-y-2">
              {globalCategories.map(({ label, icon: Icon }) => (
                <div key={label} className={`flex min-h-[44px] items-center gap-2 rounded-lg border px-3 py-2 text-[12px] ${colors.chip}`}>
                  <Icon className="h-4 w-4 shrink-0 text-cyan-500" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className={`mt-auto flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold tracking-wide transition ${dark ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300' : 'border-cyan-300 bg-cyan-50 text-cyan-800'}`}><span>EXPLORE REPOSITORY</span><ArrowRight className="h-5 w-5"/></div>
          </article>

          {/* PROJECT REPOSITORY: dropdown, recent projects and View All removed as requested. */}
          <article role="button" tabIndex={0} aria-label="Select Project Repository" onClick={() => chooseRepository('project')} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseRepository('project'); } }} className={`repo-choice-card flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6 ${colors.card}`}>
            <div className="flex items-start gap-4"><Folder className="mt-1 h-14 w-14 shrink-0 text-cyan-500" strokeWidth={1.5} /><div><h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-[#0b1b32]'}`}>Project Repository</h2><p className={`mt-1 max-w-md text-sm leading-5 ${colors.body}`}>Access project-specific engineering knowledge, documents and deliverables.</p></div></div>
            <div className="my-5">
              <div className={`h-[230px] overflow-hidden rounded-xl border ${dark ? 'border-cyan-900/70' : 'border-blue-100'} ${colors.image}`}>
                <img src="/lifex-project-repository-workflow.png" alt="Project engineering lifecycle with CAD component models, design, testing, validation and release stages" className="h-full w-full object-cover transition duration-500 hover:scale-[1.025]" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {projectCategories.map(({ label, icon: Icon }) => (
                  <div key={label} className={`flex min-h-[44px] items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] ${colors.chip}`}>
                    <Icon className="h-4 w-4 shrink-0 text-cyan-500" /><span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`mt-auto flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold tracking-wide transition ${dark ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300' : 'border-cyan-300 bg-cyan-50 text-cyan-800'}`}><span>EXPLORE REPOSITORY</span><ArrowRight className="h-5 w-5"/></div>
          </article>
        </section>
      </main>
    </div>
    <footer className={`flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4 text-[11px] sm:px-9 ${colors.footer}`}><span>Engineering Knowledge. Connected for Decisions.</span><span className="flex items-center gap-4"><span>Confidential</span><span className={dark ? 'text-slate-600' : 'text-slate-300'}>|</span><span>Version 1.0</span></span></footer>
  </div>;
};

export default EngineeringRepositoryPage;
