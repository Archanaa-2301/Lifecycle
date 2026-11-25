import React, { useMemo, useState } from 'react';
import {
  Home, Layers3, Folder, ChartNoAxesCombined, CircleHelp, Search, Bell,
  ChevronRight, ArrowRight, Grid2X2, List, CarFront, Sun, Moon, X, SlidersHorizontal
} from 'lucide-react';
import './SelectProjectPage.css';

type Project = {
 name:string; code:string; platform:string; oems:string[]; vehicleType:string; vehicleModel:string; image:string;
 projectType:string; initiatedOn:string; description:string;
};
const projects:Project[] = [
 {name:'Rear Suspension Redesign',code:'RS-2026-017',platform:'EV Platform',oems:['Tata Motors'],vehicleType:'SUV',vehicleModel:'Nexon',image:'/assets/project-1.jpg',projectType:'Design Change',initiatedOn:'15 Jan 2026',description:'Redesign and optimize the rear suspension system to improve ride comfort, durability, and overall vehicle stability for the EV platform.'},
 {name:'Brake System Optimization',code:'BS-2026-024',platform:'ICE Platform',oems:['Hyundai'],vehicleType:'SUV',vehicleModel:'Creta',image:'/assets/project-2.jpg',projectType:'Quality Improvement',initiatedOn:'02 Feb 2026',description:'Improve braking performance, thermal stability, and durability across the target ICE vehicle platform.'},
 {name:'Thermal Management Upgrade',code:'TM-2026-009',platform:'Hybrid Platform',oems:['Tata Motors'],vehicleType:'SUV',vehicleModel:'Nexon',image:'/assets/project-3.jpg',projectType:'Design Change',initiatedOn:'18 Feb 2026',description:'Optimize the thermal management architecture to improve cooling efficiency and operating reliability.'},
 {name:'E-Drive Integration',code:'ED-2026-031',platform:'EV Platform',oems:['MG'],vehicleType:'EV',vehicleModel:'ZS EV',image:'/assets/project-4.jpg',projectType:'New Development',initiatedOn:'04 Mar 2026',description:'Integrate the electric drive system with vehicle-level packaging, performance, and validation requirements.'},
 {name:'Lightweight Body Architecture',code:'LB-2026-036',platform:'Multi-Platform',oems:['Renault'],vehicleType:'Hatchback',vehicleModel:'Kwid',image:'/assets/project-5.jpg',projectType:'Cost Reduction',initiatedOn:'21 Mar 2026',description:'Evaluate lightweight body architecture options while maintaining structural performance and safety targets.'},
];

export interface SelectProjectPageProps {
  /** Optional callback when the employee presses Enter on a project. */
  onBack?: () => void;
  onProjectEnter?: (project: { name: string; code: string; platform: string; oems: string[]; vehicleType: string; vehicleModel: string; projectType: string; initiatedOn: string; description: string; image: string }) => void;
}

const SelectProjectPage: React.FC<SelectProjectPageProps> = ({ onProjectEnter, onBack }) => {
 const [theme,setTheme]=useState<'dark'|'light'>(()=>localStorage.getItem('lifex-theme')==='light'?'light':'dark');
 const [search,setSearch]=useState(''); const [platform,setPlatform]=useState('All Platforms');
 const [oem,setOem]=useState('All OEMs'); const [view,setView]=useState<'list'|'grid'>('list');
 const [notice,setNotice]=useState('');
 const filtered=useMemo(()=>projects.filter(p=>{
  const q=search.trim().toLowerCase();
  return (!q||[p.name,p.code,p.platform,...p.oems].join(' ').toLowerCase().includes(q))
   &&(platform==='All Platforms'||p.platform===platform)&&(oem==='All OEMs'||p.oems.includes(oem));
 }),[search,platform,oem]);
 const changeTheme=()=>{const next=theme==='dark'?'light':'dark';setTheme(next);localStorage.setItem('lifex-theme',next)};
 const enter=(p:Project)=>{
  if (onProjectEnter) onProjectEnter({ name: p.name, code: p.code, platform: p.platform, oems: p.oems, vehicleType: p.vehicleType, vehicleModel: p.vehicleModel, projectType: p.projectType, initiatedOn: p.initiatedOn, description: p.description, image: p.image });
  else { setNotice(`${p.name} selected`); window.setTimeout(()=>setNotice(''),2600); }
 };
 return <div className={`lifex-select-app ${theme === "light" ? "lifex-select-light" : "lifex-select-dark"}`}>
  <aside className="lifex-select-sidebar">
   <div className="lifex-select-brand"><img src="/lifex-logo.png" alt="LIFEX"/><div>Lifecycle Intelligence<br/>For Engineering Excellence</div></div>
   <nav>
    <button className="lifex-select-nav-item"><Home/><span>Dashboard</span></button>
    <button className="lifex-select-nav-item"><Layers3/><span>Global Repository</span></button>
    <button className="lifex-select-nav-item lifex-select-active"><Folder/><span>Project Repository</span></button>
    <button className="lifex-select-nav-item"><ChartNoAxesCombined/><span>Reports &amp; Insights</span></button>
    <button className="lifex-select-nav-item"><CircleHelp/><span>Help &amp; Support</span></button>
   </nav><div className="lifex-select-sidebar-wave"/>
  </aside>
  <div className="lifex-select-main-shell">
   <header className="lifex-select-topbar">
    <div className="lifex-select-breadcrumbs">{onBack && <button type="button" className="lifex-select-back-button" onClick={onBack} aria-label="Back to repository selection"><span>←</span> Back</button>}<Home/><ChevronRight/><span>Project Repository</span><ChevronRight/><strong>Select Project</strong></div>
    <div className="lifex-select-top-actions"><button className="lifex-select-icon-button" aria-label="Search"><Search/></button><button className="lifex-select-icon-button lifex-select-notification" aria-label="Notifications"><Bell/><i/></button><div className="lifex-select-avatar">A</div><button className="lifex-select-theme-toggle" onClick={changeTheme} aria-label="Toggle theme">{theme==='dark'?<Sun/>:<Moon/>}</button></div>
   </header>
   <main className="lifex-select-content">
    <div className="lifex-select-page-heading">
     <div className="lifex-select-heading-icon"><Layers3/></div>
     <div><h1>Select a Project</h1><p>Search or browse from the available projects in the repository.</p></div>
     <img className="lifex-select-heading-car" src="/assets/vehicle-banner.jpg" alt="Automotive engineering vehicle"/>
    </div>
    <section className="lifex-select-toolbar">
     <label className="lifex-select-search-box"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search project by name, code, platform, or OEM..."/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search"><X size={16}/></button>}</label>
     <label className="lifex-select-wrap"><select aria-label="Filter by program or platform" value={platform} onChange={e=>setPlatform(e.target.value)}><option>All Platforms</option><option>EV Platform</option><option>ICE Platform</option><option>Hybrid Platform</option><option>Multi-Platform</option></select><ChevronRight/></label>
     <label className="lifex-select-wrap"><select aria-label="Filter by OEM" value={oem} onChange={e=>setOem(e.target.value)}><option>All OEMs</option>{Array.from(new Set(projects.flatMap(p=>p.oems))).sort().map(v=><option key={v}>{v}</option>)}</select><ChevronRight/></label>
     <div className="lifex-select-view-switch"><button className={view==='grid'?'chosen':''} onClick={()=>setView('grid')} aria-label="Grid view"><Grid2X2/></button><button className={view==='list'?'chosen':''} onClick={()=>setView('list')} aria-label="List view"><List/></button></div>
    </section>
    <div className="lifex-select-results-line"><span>{filtered.length} projects available</span><button onClick={()=>{setSearch('');setPlatform('All Platforms');setOem('All OEMs')}}>Clear filters</button></div>
    {filtered.length===0?<div className="lifex-select-empty-state"><Search/><h3>No projects found</h3><p>Try another project name, code, platform or OEM.</p></div>:
     view==='list'?<section className="lifex-select-project-list">{filtered.map(p=><article className="lifex-select-project-row" key={p.code}>
      <span className="lifex-select-row-accent"/><img className="lifex-select-project-thumb" src={p.image} alt=""/>
      <div className="lifex-select-project-name"><strong>{p.name}</strong><span>{p.code}</span></div>
      <div className="lifex-select-platform-cell"><Layers3/><span>{p.platform}</span></div>
      <div className="lifex-select-oem-cell"><CarFront/><span>OEMs</span><div className="lifex-select-chips">{p.oems.map(x=><span key={x}>{x}</span>)}</div></div>
      <button className="lifex-select-enter-button" onClick={()=>enter(p)}>Enter <ArrowRight/></button>
     </article>)}</section>:
     <section className="lifex-select-project-grid">{filtered.map(p=><article className="lifex-select-project-card" key={p.code}><img src={p.image} alt=""/><div className="lifex-select-card-body"><h3>{p.name}</h3><span className="lifex-select-code">{p.code}</span><p><Layers3 size={16}/>{p.platform}</p><div className="lifex-select-chips">{p.oems.map(x=><span key={x}>{x}</span>)}</div><button className="lifex-select-enter-button" onClick={()=>enter(p)}>Enter <ArrowRight/></button></div></article>)}</section>}
    {notice&&<div role="status" className="lifex-select-toast">{notice}</div>}
   </main>
   <footer className="lifex-select-footer"><span>LIFEX · Lifecycle Intelligence for Engineering Excellence</span><span>Engineering knowledge, connected.</span></footer>
  </div>
 </div>
}
export default SelectProjectPage;
