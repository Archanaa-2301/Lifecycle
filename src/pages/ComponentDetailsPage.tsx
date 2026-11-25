import React from 'react';
import { PageId } from '../types/lifex';
import { ArrowLeft, Layers3, ShieldCheck, Gauge, MoveVertical, CircleDot, Workflow } from 'lucide-react';

interface Props { onNavigate: (page: PageId) => void; }

type Part = { name: string; group: string; purpose: string; operation: string; engineeringFocus: string; visual: number; };
const parts: Part[] = [
  { name: 'Rebound Bumper', group: 'CORE COMPONENT 01', purpose: 'Provides a progressive cushion as the shock absorber approaches its full-extension limit.', operation: 'During rebound, the bumper engages near the end of travel and helps reduce impact loading between internal moving parts.', engineeringFocus: 'Bumper geometry • compression behaviour • durability • fit with rod and guide', visual: 0 },
  { name: 'Rod Guide', group: 'CORE COMPONENT 02', purpose: 'Guides the piston rod along the damper axis and provides the interface for the rod sealing arrangement.', operation: 'Maintains rod alignment during suspension movement while supporting the sealing and guiding functions at the upper end of the damper.', engineeringFocus: 'Rod alignment • guide clearance • sealing interface • wear resistance', visual: 1 },
  { name: 'Rod', group: 'CORE COMPONENT 03', purpose: 'Transfers axial movement between the suspension attachment and the internal piston mechanism.', operation: 'Moves in and out of the damper body as the suspension articulates, transmitting motion to the piston assembly.', engineeringFocus: 'Diameter • straightness • surface finish • corrosion and fatigue resistance', visual: 2 },
  { name: 'Spring Seat', group: 'APPLICATION COMPONENT 01', purpose: 'Locates and supports the coil spring at its defined position on the suspension assembly.', operation: 'Receives spring load and transfers it into the surrounding suspension structure while maintaining spring location.', engineeringFocus: 'Spring seating profile • load path • retention • corrosion protection', visual: 3 },
  { name: 'Top Mount', group: 'APPLICATION COMPONENT 02', purpose: 'Forms the upper mounting interface between the suspension assembly and the vehicle body.', operation: 'Supports the assembly at the body-side attachment and may incorporate isolation features to manage vibration transfer.', engineeringFocus: 'Mounting interface • stiffness • isolation • package envelope', visual: 4 },
  { name: 'Bumper Cap', group: 'APPLICATION COMPONENT 03', purpose: 'Provides a protective cover or interface around the bump-stop region of the application.', operation: 'Helps shield the associated upper bumper area from environmental exposure and supports the intended assembly interface.', engineeringFocus: 'Coverage • retention • clearance • environmental durability', visual: 5 },
];

function PartIllustration({ index }: { index: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return <svg viewBox="0 0 240 170" role="img" aria-label={`${parts[index].name} technical illustration`} className="h-full w-full text-cyan-300">
    <defs><linearGradient id={`metal-${index}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a5f3fc" stopOpacity=".7"/><stop offset=".55" stopColor="#155e75" stopOpacity=".55"/><stop offset="1" stopColor="#0e2938" stopOpacity=".9"/></linearGradient></defs>
    <g {...common}>
      {index===0 && <><path d="M92 24h56v18l-7 8v56l7 9v22H92v-22l7-9V50l-7-8z" fill={`url(#metal-${index})`} /><path d="M100 52h40M100 63h40M100 74h40M100 85h40M100 96h40" opacity=".8"/><path d="M75 34h90M75 130h90" strokeDasharray="4 5" opacity=".55"/><path d="M120 15v9M120 145v10"/></>}
      {index===1 && <><path d="M86 30h68l10 18v75l-10 18H86l-10-18V48z" fill={`url(#metal-${index})`}/><circle cx="120" cy="85" r="26"/><circle cx="120" cy="85" r="13"/><path d="M76 57h-18M76 112H58M164 57h18M164 112h18"/><path d="M94 39h52M94 132h52" opacity=".7"/></>}
      {index===2 && <><rect x="111" y="18" width="18" height="132" rx="7" fill={`url(#metal-${index})`}/><path d="M104 35h32M104 45h32M104 126h32"/><path d="M120 10v8M120 150v8"/><path d="M88 18h24M128 18h24" strokeDasharray="3 4" opacity=".55"/></>}
      {index===3 && <><path d="M63 93h114l-12 34H75z" fill={`url(#metal-${index})`}/><path d="M76 91c0-18 14-32 44-32s44 14 44 32"/><path d="M84 57c10-12 62-12 72 0M91 48c10-9 48-9 58 0"/><path d="M73 135h94M120 20v20" strokeDasharray="4 5" opacity=".6"/></>}
      {index===4 && <><path d="M76 48h88l-8 22H84z" fill={`url(#metal-${index})`}/><path d="M87 70v42c0 18 14 30 33 30s33-12 33-30V70"/><path d="M100 83h40M100 96h40M100 109h40"/><circle cx="120" cy="42" r="8"/><path d="M70 145h100" strokeDasharray="4 5" opacity=".55"/></>}
      {index===5 && <><path d="M78 45h84l-7 73-16 18h-38l-16-18z" fill={`url(#metal-${index})`}/><path d="M78 57h84M85 68h70M92 80h56"/><path d="M96 136v10M144 136v10M120 20v18"/><path d="M68 45h104" strokeDasharray="4 5" opacity=".55"/></>}
    </g>
    <g fill="#67e8f9" opacity=".8"><circle cx="25" cy="28" r="2"/><circle cx="211" cy="42" r="2"/><circle cx="37" cy="137" r="1.5"/><circle cx="202" cy="132" r="1.5"/></g>
    <path d="M20 155H220" stroke="#164e63" strokeWidth="1"/><text x="120" y="166" textAnchor="middle" fill="#67e8f9" fontSize="7" letterSpacing="2">ILLUSTRATIVE ENGINEERING VIEW</text>
  </svg>;
}

const DetailCard: React.FC<{ part: Part; index: number }> = ({ part, index }) => (
  <article className="overflow-hidden rounded-2xl border border-cyan-900/50 bg-[#071723]/90 shadow-[0_12px_35px_rgba(0,0,0,.2)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_16px_40px_rgba(0,190,220,.09)]">
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">
      <div className="relative flex min-h-[190px] items-center justify-center overflow-hidden border-b border-cyan-950/70 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,.16),rgba(4,12,20,.1)_68%)] p-4 sm:border-b-0 sm:border-r">
        <div className="absolute left-4 top-4 text-[9px] font-bold tracking-[.16em] text-cyan-500/80">FIG. 0{index+1}</div>
        <PartIllustration index={part.visual}/>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2"><span className="text-[9px] font-bold tracking-[.16em] text-cyan-400">{part.group}</span><span className="rounded-full border border-cyan-900/70 px-2 py-0.5 text-[9px] text-slate-400">REAR SHOCK ABSORBER</span></div>
        <h2 className="text-xl font-semibold tracking-tight text-white">{part.name}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{part.purpose}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-[#06121c] p-3"><div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300"><Gauge className="h-3.5 w-3.5"/> Function & operation</div><p className="text-xs leading-5 text-slate-400">{part.operation}</p></div>
          <div className="rounded-xl border border-slate-800 bg-[#06121c] p-3"><div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-300"><Layers3 className="h-3.5 w-3.5"/> Engineering focus</div><p className="text-xs leading-5 text-slate-400">{part.engineeringFocus}</p></div>
        </div>
      </div>
    </div>
  </article>
);

export const ComponentDetailsPage: React.FC<Props> = ({ onNavigate }) => (
  <main className="min-h-screen bg-[#040c14] px-4 py-6 text-slate-100 sm:px-8 sm:py-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-7 flex flex-col gap-4 border-b border-cyan-950/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400"><span>Rear Suspension Assembly</span><span className="text-slate-600">/</span><span>Component Knowledge</span></div><h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Six Component Engineering Guide</h1><p className="mt-1.5 max-w-3xl text-sm text-slate-400">Purpose, operating role and key engineering considerations for the three core and three application components.</p></div>
        <button onClick={() => onNavigate(9)} className="inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-900/70 bg-[#081723] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/60 hover:text-white"><ArrowLeft className="h-4 w-4"/> Back to Components</button>
      </header>
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-cyan-900/50 bg-[#071723] p-3"><div className="text-[9px] uppercase tracking-widest text-cyan-400">Total components</div><div className="mt-1 text-2xl font-semibold text-white">06</div></div>
        <div className="rounded-xl border border-cyan-900/50 bg-[#071723] p-3"><div className="text-[9px] uppercase tracking-widest text-cyan-400">Core</div><div className="mt-1 text-2xl font-semibold text-white">03</div></div>
        <div className="rounded-xl border border-teal-900/50 bg-[#071723] p-3"><div className="text-[9px] uppercase tracking-widest text-teal-400">Application</div><div className="mt-1 text-2xl font-semibold text-white">03</div></div>
        <div className="rounded-xl border border-slate-800 bg-[#071723] p-3"><div className="text-[9px] uppercase tracking-widest text-slate-400">Knowledge view</div><div className="mt-1 text-sm font-semibold text-white">Function + role</div></div>
      </section>
      <div className="mb-4 flex items-center gap-3"><span className="h-5 w-1 rounded-full bg-cyan-400"/><h2 className="text-sm font-bold uppercase tracking-[.15em] text-slate-100">Core Components</h2></div>
      <div className="space-y-4">{parts.slice(0,3).map((part,i)=><DetailCard key={part.name} part={part} index={i}/>)}</div>
      <div className="mb-4 mt-8 flex items-center gap-3"><span className="h-5 w-1 rounded-full bg-teal-400"/><h2 className="text-sm font-bold uppercase tracking-[.15em] text-slate-100">Application Components</h2></div>
      <div className="space-y-4">{parts.slice(3).map((part,i)=><DetailCard key={part.name} part={part} index={i+3}/>)}</div>
      <p className="mt-6 rounded-xl border border-slate-800 bg-[#06121c] p-4 text-[11px] leading-5 text-slate-500">Note: The illustrations are schematic representations, not production CAD drawings. Exact materials, dimensions, tolerances and supplier specifications should be populated from the approved design data for the selected vehicle program.</p>
    </div>
  </main>
);
