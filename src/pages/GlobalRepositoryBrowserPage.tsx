import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, FileText, GitBranch, Search,
  Eye, Download, Layers3, Cpu, BatteryCharging, Gauge, Wrench, Network,
  CircleHelp, ShieldCheck, ChevronRight, FolderOpen, Boxes,
} from 'lucide-react';
import type { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';
import { INITIAL_PARTS } from '../data/initialParts';
import { readRepositoryPDFs, syncRepositoryPDFs, viewPDF, openPDF, createPDFBase64, type RepositoryPDF } from '../utils/repositoryStore';
import { runSelectionFlight } from '../utils/selectionMotion';

interface Props { onNavigate: (page: PageId) => void; }
type GlobalAreaId = 'Design Rules' | 'Templates' | 'Process';
type Area = { id: GlobalAreaId; title: string; description: string; icon: React.ElementType };
type System = { id: string; title: string; description: string; icon: React.ElementType; image: string };
type VehicleComponent = { id: string; name: string; description: string; image: string; source: 'powertrain' | 'suspension'; sourceIndex: number };

const areas: Area[] = [
  { id: 'Design Rules', title: 'Design Rules', description: 'Component design principles, engineering constraints and design guidance.', icon: BookOpen },
  { id: 'Templates', title: 'Templates', description: 'Reusable engineering templates and structured working documents.', icon: FileText },
  { id: 'Process', title: 'Process', description: 'Standard engineering workflows, reviews and validation process.', icon: GitBranch },
];

const systems: System[] = [
  { id: 'powertrain', title: 'Powertrain', description: 'Engine power unit and rotating / reciprocating engine components.', icon: Gauge, image: '/vehicle-systems/powertrain.webp' },
  { id: 'rear-suspension', title: 'Rear Suspension', description: 'Rear axle, damper and suspension components.', icon: Wrench, image: '/vehicle-systems/rear-suspension.webp' },
  { id: 'body-chassis', title: 'Body & Chassis', description: 'Vehicle body structure and chassis systems.', icon: Layers3, image: '/vehicle-systems/body-chassis.webp' },
  { id: 'electrical', title: 'Electrical', description: 'Vehicle electrical and electronic systems.', icon: Cpu, image: '/vehicle-systems/electrical.webp' },
  { id: 'interior', title: 'Interior', description: 'Cabin and occupant interface systems.', icon: Network, image: '/vehicle-systems/interior.webp' },
  { id: 'transmission', title: 'Transmission', description: 'Power transmission and driveline systems.', icon: Gauge, image: '/vehicle-systems/transmission.webp' },
  { id: 'steering', title: 'Steering', description: 'Steering control and linkage systems.', icon: Network, image: '/vehicle-systems/steering.webp' },
  { id: 'front-suspension', title: 'Front Suspension', description: 'Front axle and suspension systems.', icon: Wrench, image: '/vehicle-systems/front-suspension.webp' },
  { id: 'braking', title: 'Braking', description: 'Service and parking brake systems.', icon: CircleHelp, image: '/vehicle-systems/braking.webp' },
  { id: 'battery', title: 'Battery', description: 'Vehicle battery and energy storage systems.', icon: BatteryCharging, image: '/vehicle-systems/electrical.webp' },
  { id: 'safety', title: 'Safety', description: 'Occupant and vehicle safety systems.', icon: ShieldCheck, image: '/vehicle-systems/body-chassis.webp' },
];

const powertrainImagePaths = [
  '/vehicle-components/piston_pins_gudgeon_pins_1793331136794.jpg',
  '/vehicle-components/piston_crown_skirt_1793331137374.jpg',
  '/vehicle-components/connecting_rod_bearing_1793331137723.jpg',
  '/vehicle-components/forged_steel_crankshaft_1793331137780.jpg',
  '/vehicle-components/piston-rings.webp', '/vehicle-components/oil-control-ring-set.webp',
  '/vehicle-components/connecting-rod-bearing-shell.webp', '/vehicle-components/main-bearing-shell.webp',
  '/vehicle-components/cylinder-block.webp', '/vehicle-components/cylinder-liner.webp',
  '/vehicle-components/main-bearing-bedplate.webp', '/vehicle-components/flywheel.webp',
  '/vehicle-components/oil-sump-pan.webp', '/vehicle-components/oil-pump-assembly.webp',
  '/vehicle-components/timing-cover.webp', '/vehicle-components/rear-main-seal-carrier.webp',
  '/vehicle-components/crankshaft-harmonic-balancer.webp',
];
const powertrainComponents: VehicleComponent[] = INITIAL_PARTS.map((part, index) => ({
  id: part.partNo, name: part.name, description: part.partDescription,
  image: powertrainImagePaths[index] || '/vehicle-components/piston-rings.webp',
  source: 'powertrain', sourceIndex: index,
}));
const suspensionComponents: VehicleComponent[] = COMPONENTS.map((part, index) => ({
  id: part.id, name: part.name, description: part.purpose,
  image: ['/rebound-bumper.png', '/rod-guide.png', '/rod.png', '/spring-seat.png', '/top-mount.png', '/bumper-cap.png'][index] || '/rebound-bumper.png',
  source: 'suspension', sourceIndex: index,
}));

export const GlobalRepositoryBrowserPage: React.FC<Props> = ({ onNavigate }) => {
  const [area, setArea] = useState<GlobalAreaId | null>(null);
  const [systemId, setSystemId] = useState<string | null>(null);
  const [component, setComponent] = useState<VehicleComponent | null>(null);
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<RepositoryPDF[]>(readRepositoryPDFs);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState('');
  const [selectionBusy, setSelectionBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingDocs(true);
    void syncRepositoryPDFs().then(items => { if (active) setDocuments(items); })
      .catch(() => { if (active) setError('The repository document service is unavailable. Start the LIFEX server and try again.'); })
      .finally(() => { if (active) setLoadingDocs(false); });
    const refresh = () => setDocuments(readRepositoryPDFs());
    window.addEventListener('lifex-repository-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => { active = false; window.removeEventListener('lifex-repository-updated', refresh); window.removeEventListener('storage', refresh); };
  }, []);

  const selectedArea = areas.find(item => item.id === area);
  const selectedSystem = systems.find(item => item.id === systemId);
  const vehicleComponents = useMemo(() => {
    const source = systemId === 'powertrain' ? powertrainComponents : systemId === 'rear-suspension' ? suspensionComponents : [];
    return source.filter(item => `${item.name} ${item.id} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  }, [systemId, query]);
  const repositoryDocs = useMemo(() => documents.filter(doc => String(doc.repository) === area).slice(0, 1), [documents, area]);
  const isReboundBumperDesignRule = area === 'Design Rules' && component?.name.trim().toLowerCase() === 'rebound bumper';
  const visibleDocument = useMemo<RepositoryPDF | null>(() => {
    if (isReboundBumperDesignRule) {
      return {
        id: 'GLOBAL-DESIGN-RULE-REBOUND-BUMPER',
        title: 'Rebound Bumper - Design Rule & Validation Guideline.pdf',
        sourceType: 'Manual Entry',
        component: 'Rebound Bumper',
        repository: 'Know-How',
        savedAt: '',
        sourceDate: '15-page engineering guideline',
        pdfBase64: '',
      };
    }
    if (repositoryDocs[0]) return repositoryDocs[0];
    if (!area || !component) return null;
    const title = area === 'Design Rules'
      ? `${component.name} - Design Rule`
      : area === 'Templates'
        ? `${component.name} - Engineering Template`
        : `${component.name} - Engineering Process`;
    const lines = area === 'Design Rules'
      ? ['Component design rule reference', `Component: ${component.name}`, `System: ${selectedSystem?.title || 'Vehicle system'}`, 'Define functional requirements, material constraints, dimensional controls, interface requirements and validation criteria.', 'Verify the design against approved drawings, applicable specifications and test evidence.']
      : area === 'Templates'
        ? ['Reusable engineering template', `Component: ${component.name}`, `System: ${selectedSystem?.title || 'Vehicle system'}`, 'Sections: purpose and scope; input references; requirements; design parameters; verification method; approval and revision history.', 'Complete each field with project-approved values before release.']
        : ['Standard engineering process', `Component: ${component.name}`, `System: ${selectedSystem?.title || 'Vehicle system'}`, '1. Define scope and inputs. 2. Review applicable requirements. 3. Perform engineering assessment. 4. Record risks and decisions. 5. Verify outputs. 6. Obtain approval and retain evidence.'];
    return {
      id: `GLOBAL-${area.replace(/\\s+/g, '-').toUpperCase()}-${component.id}`,
      title: `${title}.pdf`,
      sourceType: 'Manual Entry',
      component: component.name,
      repository: 'Know-How',
      savedAt: '',
      sourceDate: 'Reference document',
      pdfBase64: createPDFBase64(title, lines),
    };
  }, [repositoryDocs, area, component, selectedSystem, isReboundBumperDesignRule]);


  const goBack = () => {
    if (component) setComponent(null);
    else if (systemId) { setSystemId(null); setQuery(''); }
    else if (area) { setArea(null); setSystemId(null); }
    else onNavigate(27);
  };
  const chooseArea = (id: GlobalAreaId) => {
    setArea(id);
    setSystemId(null);
    setComponent(null);
    setQuery('');
    setError('');
    setSelectionBusy(false);
  };
  const chooseSystem = (id: string, source: HTMLButtonElement) => {
    if (selectionBusy) return; setSelectionBusy(true);
    runSelectionFlight(source, { title: systems.find(item => item.id === id)?.title || id, subtitle: 'VEHICLE SYSTEM', imageSrc: systems.find(item => item.id === id)?.image, targetElement: document.querySelector<HTMLElement>('.global-hierarchy'), duration: 940, onComplete: () => { setSystemId(id); setComponent(null); setQuery(''); setSelectionBusy(false); } });
  };
  const chooseComponent = (item: VehicleComponent, source: HTMLButtonElement) => {
    if (selectionBusy) return; setSelectionBusy(true);
    runSelectionFlight(source, { title: item.name, subtitle: 'COMPONENT SELECTED', imageSrc: item.image, targetElement: document.querySelector<HTMLElement>('.global-hierarchy'), duration: 940, onComplete: () => { setComponent(item); setSelectionBusy(false); } });
  };
  const pageTitle = component?.name || selectedSystem?.title || selectedArea?.title || 'Global Repository';
  const pageDescription = component
    ? `Browse ${area} documents associated with ${component.name}.`
    : selectedSystem
      ? `Explore ${selectedSystem.title} and follow the component branches to the detailed records.`
      : selectedArea ? 'Select a vehicle system to explore its main components and subcomponents.'
      : 'Choose one of the three shared engineering repositories.';

  const Hierarchy = () => (
    <aside className="global-hierarchy rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_12px_34px_rgba(32,82,160,.08)]">
      <p className="mb-4 text-[10px] font-extrabold tracking-[.2em] text-cyan-600">SELECTION HIERARCHY</p>
      <div className="space-y-2">
        {selectedArea && <><div className="hierarchy-node active"><span className="hierarchy-icon"><FolderOpen size={21}/></span><div><b>{selectedArea.title}</b><small>Selected global repository</small></div><ShieldCheck className="ml-auto h-4 w-4 text-emerald-500"/></div><div className="hierarchy-down">↓</div></>}
        {selectedSystem && <><div className="hierarchy-node active"><span className="hierarchy-icon"><Wrench size={21}/></span><div><b>{selectedSystem.title}</b><small>Vehicle system</small></div><ShieldCheck className="ml-auto h-4 w-4 text-emerald-500"/></div><div className="hierarchy-down">↓</div></>}
        {component && <div className="hierarchy-node active"><span className="hierarchy-thumb"><img src={component.image} alt=""/></span><div><b>{component.name}</b><small>Selected component</small></div><ShieldCheck className="ml-auto h-4 w-4 text-emerald-500"/></div>}
      </div>
      <div className="mt-6 rounded-xl bg-blue-50 p-3 text-xs text-slate-500"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"/>{selectedArea ? `${selectedArea.title} repository context active` : 'Choose a repository to begin'}</div>
    </aside>
  );

  return (
    <main className="global-repository-page min-h-screen px-4 py-7 sm:px-7 lg:px-10">
      <style>{`
        @keyframes globalFadeUp { from { opacity:0; transform:translateY(22px) scale(.985); filter:blur(3px) } to { opacity:1; transform:translateY(0) scale(1); filter:blur(0) } }
        @keyframes globalArrowDraw { from { opacity:0; transform:scaleX(.15); } to { opacity:1; transform:scaleX(1); } }
        @keyframes globalNodePulse { 0%,100% { box-shadow:0 0 0 0 rgba(37,99,235,0); } 50% { box-shadow:0 0 0 7px rgba(37,99,235,.08); } }
        .global-repository-page { background:linear-gradient(135deg,#f8fbff 0%,#eef5ff 52%,#f9fbff 100%); color:#14264c; }
        .global-enter { animation:globalFadeUp .55s cubic-bezier(.2,.75,.25,1) both; }
        .global-arrow { transform-origin:left center; animation:globalArrowDraw .55s cubic-bezier(.2,.75,.25,1) both; }
        .global-card { border:1px solid #d8e5fb; background:rgba(255,255,255,.96); box-shadow:0 10px 30px rgba(36,82,150,.07); transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease; }
        .global-card:hover { transform:translateY(-5px); border-color:#8bb8ff; box-shadow:0 18px 36px rgba(37,99,235,.13); }
        .global-card img { transition:transform .4s ease,filter .4s ease; }
        .global-card:hover img { transform:scale(1.07); filter:drop-shadow(0 8px 12px rgba(37,99,235,.15)); }
        .hierarchy-node { display:flex; align-items:center; gap:10px; min-height:66px; border:1px solid #dbe7fa; border-radius:13px; padding:10px; background:#fff; box-shadow:0 4px 12px rgba(32,82,160,.04); }
        .hierarchy-node.active { border-color:#83b4ff; background:#eff6ff; animation:globalNodePulse 2.2s ease-in-out infinite; }
        .hierarchy-icon { display:grid; place-items:center; width:38px;height:38px;border-radius:10px;background:#eff6ff;color:#1764e8;flex:none;font-size:24px; }
        .hierarchy-node b { display:block;font-size:13px;color:#172b55;line-height:1.25 }
        .hierarchy-node small { display:block;margin-top:4px;font-size:10px;color:#8496b5 }
        .hierarchy-thumb { width:38px;height:38px;flex:none;background:#f2f6fc;border-radius:8px;overflow:hidden;display:grid;place-items:center }
        .hierarchy-thumb img { width:100%;height:100%;object-fit:contain }
        .hierarchy-down { text-align:center;color:#2878f0;font-size:23px;line-height:20px;font-weight:700;animation:globalFadeUp .4s both }
        .branch-source { position:relative; border:1px solid #9cc3ff;background:linear-gradient(145deg,#fff,#edf5ff);border-radius:17px;padding:18px;box-shadow:0 12px 28px rgba(37,99,235,.10); }
        .branch-source:after { content:'';position:absolute;right:-35px;top:50%;width:35px;height:2px;background:#2c79f6; }
        .branch-component { position:relative; }
        .branch-component:before { content:'';position:absolute;left:-22px;top:50%;width:22px;height:2px;background:#2c79f6;transform-origin:left center;animation:globalArrowDraw .5s both; }
        .branch-component:after { content:'';position:absolute;left:-4px;top:calc(50% - 4px);border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:7px solid #2c79f6; }
        .global-btn { background:linear-gradient(100deg,#1260ed,#2879ff);color:white;box-shadow:0 9px 20px rgba(37,99,235,.2);transition:transform .2s,box-shadow .2s }
        .global-btn:hover { transform:translateY(-2px);box-shadow:0 13px 25px rgba(37,99,235,.28) }
        @media(prefers-reduced-motion:reduce){.global-enter,.global-arrow,.hierarchy-node.active{animation:none!important}.global-card,.global-card img{transition:none!important}}
      `}</style>
      <div key={`${area || 'root'}-${systemId || 'systems'}-${component?.id || 'none'}`} className="mx-auto max-w-[1540px] global-enter">
        <button onClick={goBack} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><ArrowLeft size={17}/>{component ? 'Back to components' : selectedSystem ? 'Back to systems' : selectedArea ? 'All repositories' : 'Engineering Repository'}</button>
        <header className="mb-7 border-b border-blue-100 pb-5">
          <p className="text-[10px] font-extrabold tracking-[.22em] text-cyan-600">GLOBAL REPOSITORY / {selectedArea ? selectedArea.title.toUpperCase() : 'SHARED VEHICLE KNOWLEDGE'}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-extrabold tracking-tight text-[#152951] sm:text-4xl">{pageTitle}</h1><p className="mt-2 text-sm text-slate-500">{pageDescription}</p></div>{selectedArea && <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-blue-700">{selectedArea.title} · Global Repository</span>}</div>
        </header>

        {!selectedArea ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {areas.map((item,index)=>{const Icon=item.icon;return <button key={item.id} style={{animationDelay:`${index*110}ms`}} onClick={()=>chooseArea(item.id)} disabled={selectionBusy} className="global-enter global-card group rounded-2xl p-7 text-left">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:scale-110"><Icon size={30}/></div>
              <h2 className="text-xl font-extrabold text-[#172b55]">{item.title}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{item.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-blue-50 pt-4"><span className="text-xs text-slate-400">1 curated document</span><span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">Open repository <ArrowRight size={16}/></span></div>
            </button>})}
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[275px_minmax(0,1fr)]">
            <Hierarchy/>
            <section className="min-w-0">
              {!selectedSystem ? (
                <>
                  <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-[#172b55]">Vehicle Systems</h2><p className="mt-1 text-xs text-slate-500">Choose a system to open its component relationship map.</p></div><span className="rounded-full bg-white px-3 py-2 text-xs text-blue-700 shadow-sm">{systems.length} systems</span></div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {systems.map((item,index)=>{const Icon=item.icon;const count=item.id==='powertrain'?powertrainComponents.length:item.id==='rear-suspension'?suspensionComponents.length:0;return <button key={item.id} style={{animationDelay:`${index*55}ms`}} onClick={(event)=>chooseSystem(item.id, event.currentTarget)} disabled={selectionBusy} className="global-enter global-card group overflow-hidden rounded-2xl text-left">
                      <div className="flex h-36 items-center justify-center overflow-hidden border-b border-blue-50 bg-gradient-to-br from-white to-blue-50 p-3"><img src={item.image} alt={`${item.title} system`} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/lifex-wireframe-car.png'}} className="h-full w-full object-contain"/></div>
                      <div className="p-4"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-blue-600"/><h3 className="font-bold text-[#172b55]">{item.title}</h3></div><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{item.description}</p><div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-400">{count?`${count} detailed components`:'System category'}</span><span className="inline-flex items-center gap-1 font-bold text-blue-600">Explore <ArrowRight size={14}/></span></div></div>
                    </button>})}
                  </div>
                </>
              ) : !component ? (
                <>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-cyan-600">ASSEMBLY RELATIONSHIP MAP</p><h2 className="mt-1 text-2xl font-extrabold text-[#172b55]">{selectedSystem.title} Components</h2><p className="mt-1 text-sm text-slate-500">Select a component node to open its {selectedArea?.title.toLowerCase()} records.</p></div><div className="relative w-full max-w-xs"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a component" className="h-10 w-full rounded-xl border border-blue-100 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400"/></div></div>
                  {vehicleComponents.length ? (
                    <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="flex items-center"><div className="branch-source w-full"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Boxes size={26}/></div><p className="text-[10px] font-extrabold tracking-widest text-cyan-600">PARENT SYSTEM</p><h3 className="mt-1 text-lg font-extrabold text-[#172b55]">{selectedSystem.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{selectedSystem.description}</p><div className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{vehicleComponents.length} connected components</div></div></div>
                      <div className="relative grid gap-3 md:grid-cols-2">
                        <div className="pointer-events-none absolute -left-5 bottom-8 top-8 hidden w-px bg-blue-300 xl:block"/>
                        {vehicleComponents.map((item,index)=><button key={item.id} style={{animationDelay:`${index*85}ms`}} onClick={(event)=>chooseComponent(item, event.currentTarget)} disabled={selectionBusy} className="global-enter branch-component global-card flex min-h-[112px] items-center gap-4 rounded-xl p-3 text-left">
                          <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-2"><img src={item.image} alt={item.name} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/lifex-wireframe-car.png'}} className="h-full w-full object-contain"/></div>
                          <div className="min-w-0 flex-1"><p className="font-mono text-[9px] text-cyan-600">{item.id}</p><h3 className="mt-1 font-extrabold text-[#172b55]">{item.name}</h3><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">{item.description}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">Open component <ChevronRight size={13}/></span></div>
                        </button>)}
                      </div>
                    </div>
                  ) : <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="font-bold text-amber-900">Component-level records are not yet available for {selectedSystem.title}.</p><p className="mt-2 text-sm text-amber-800">The current project source contains detailed component data for Powertrain and Rear Suspension. The other system categories are available here, but their component lists have not been supplied in the existing project.</p></div>}
                </>
              ) : (
                <section className="global-card rounded-2xl p-5 sm:p-7">
                  <div className="mb-6 flex flex-wrap items-center gap-4"><div className="flex h-28 w-36 items-center justify-center rounded-xl bg-blue-50 p-3"><img src={component.image} alt={component.name} className="h-full w-full object-contain"/></div><div><p className="text-[10px] font-extrabold tracking-[.18em] text-cyan-600">SELECTED COMPONENT</p><h2 className="mt-1 text-2xl font-extrabold text-[#172b55]">{component.name}</h2><p className="mt-2 max-w-2xl text-sm text-slate-500">{component.description}</p></div></div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 pt-5"><div><h2 className="text-xl font-extrabold text-[#172b55]">{selectedArea?.title} — Documents</h2><p className="mt-1 text-xs text-slate-500">{component.name} · {visibleDocument ? 1 : 0} document</p></div><span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{loadingDocs?'Syncing document…':`${visibleDocument ? 1 : 0} document`}</span></div>
                  
                  {error&&<p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
                  {visibleDocument?<div className="grid gap-3">{[visibleDocument].map(doc=><article key={doc.id} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-sm"><FileText className="h-7 w-7 shrink-0 text-blue-600"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#172b55]">{doc.title}</p><p className="mt-1 text-[10px] text-slate-400">{doc.id} · {doc.sourceType} · {doc.sourceDate}</p>{doc.component&&<p className="mt-1 truncate text-[10px] text-slate-500">Tagged component: {doc.component}</p>}</div><button type="button" title="Open PDF" onClick={()=>isReboundBumperDesignRule ? window.open('/design-principles/rebound-bumper-design-principle.pdf','_blank','noopener,noreferrer') : viewPDF(doc.pdfBase64)} className="rounded-lg border border-blue-100 p-2 text-blue-700 hover:bg-blue-50"><Eye size={16}/></button><button type="button" title="Download PDF" onClick={()=>{if(isReboundBumperDesignRule){const link=document.createElement('a');link.href='/design-principles/rebound-bumper-design-principle.pdf';link.download=doc.title;document.body.appendChild(link);link.click();link.remove();}else openPDF(doc.pdfBase64,doc.title);}} className="rounded-lg border border-blue-100 p-2 text-blue-700 hover:bg-blue-50"><Download size={16}/></button></article>)}</div>:<div className="rounded-xl border border-dashed border-blue-200 bg-blue-50 p-8 text-center"><FileText className="mx-auto h-9 w-9 text-blue-300"/><p className="mt-3 text-sm font-bold text-slate-700">No PDF documents found in this repository</p><p className="mt-1 text-xs text-slate-500">Check the repository-data folder and LIFEX API server.</p></div>}
                </section>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
};
