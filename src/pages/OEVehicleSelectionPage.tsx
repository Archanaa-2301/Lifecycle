import React, { useMemo, useRef, useState } from 'react';
import {
  ChevronRight, Sun, Bell, ChevronDown, Search, Check,
  ArrowLeftRight, ArrowLeft, ArrowRight, CarFront, CircleCheck,
  Gauge, Sparkles
} from 'lucide-react';
import type { PageId, Vehicle } from '../types/lifex';
import './OEVehicleSelectionPage.css';
import { runSelectionFlight } from '../utils/selectionMotion';

type ProjectPreset = {
  name?: string;
  code?: string;
  platform?: string;
  oems?: string[];
  vehicleType?: string;
  vehicleModel?: string;
};

interface Props {
  onNavigate: (page: PageId) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

const VEHICLES = [
  {
    name: 'Innova', type: 'MPV', category: 'SUV' as const, year: 2026,
    trim: 'Crysta', powertrain: '2.4L Diesel',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1100&q=90',
    tag: 'Family & utility', code: 'INN'
  },
  {
    name: 'Fortuner', type: 'SUV', category: 'SUV' as const, year: 2026,
    trim: 'Legender', powertrain: '2.8L Turbo Diesel',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1100&q=90',
    tag: 'Performance SUV', code: 'FOR'
  },
  {
    name: 'Camry', type: 'Sedan', category: 'Sedan' as const, year: 2026,
    trim: 'Hybrid', powertrain: '2.5L Petrol Hybrid',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1100&q=90',
    tag: 'Executive sedan', code: 'CAM'
  },
  {
    name: 'Glanza', type: 'Hatchback', category: 'Sedan' as const, year: 2026,
    trim: 'V', powertrain: '1.2L Petrol',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1100&q=90',
    tag: 'Urban hatchback', code: 'GLA'
  }
];

export const OEVehicleSelectionPage: React.FC<Props> = ({ onNavigate, onSelectVehicle }) => {
  const project = useMemo<ProjectPreset>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('lifex-project-preset') ||
        localStorage.getItem('lifex-active-project') || '{}'
      ) as ProjectPreset;
    } catch { return {}; }
  }, []);

  const oe = project.oems?.[0] || 'Toyota';
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [vehicleConfirmed, setVehicleConfirmed] = useState(false);
  const [vehicleArriving, setVehicleArriving] = useState(false);
  const [selectionInProgress, setSelectionInProgress] = useState(false);
  const hierarchyVehicleRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const selected = selectedIndex >= 0 ? VEHICLES[selectedIndex] : null;
  const chooseVehicle = (index: number, source: HTMLButtonElement) => {
    if (selectionInProgress) return;
    const vehicle = VEHICLES[index];
    setSelectedIndex(index);
    setVehicleConfirmed(false);
    setVehicleArriving(false);
    setSelectionInProgress(true);
    runSelectionFlight(source, {
      title: vehicle.name,
      subtitle: `${vehicle.type.toUpperCase()} · VEHICLE SELECTED`,
      imageSrc: vehicle.image,
      targetElement: hierarchyVehicleRef.current,
      duration: 1080,
      onComplete: () => {
        setVehicleConfirmed(true);
        setVehicleArriving(true);
        // The card selection is the navigation action: land the vehicle in the
        // hierarchy, update the app-wide vehicle context, then open the overview.
        window.setTimeout(() => {
          localStorage.setItem('lifex-selected-vehicle-name', vehicle.name);
          localStorage.setItem('lifex-selected-vehicle-full-name', `${oe} ${vehicle.name}`);
          const brand = (['Ford', 'Toyota', 'BMW', 'Honda', 'Tesla'].includes(oe) ? oe : 'Other') as Vehicle['brand'];
          onSelectVehicle({
            id: `${oe.toLowerCase().replace(/\s+/g, '-')}-${vehicle.name.toLowerCase()}`,
            name: `${oe} ${vehicle.name}`, brand, year: vehicle.year, trim: vehicle.trim,
            category: vehicle.category, powertrain: vehicle.powertrain,
            transmission: 'Project specification', driveType: 'Project specification',
            program: project.name || 'LIFEX Project', region: 'India',
            architectureType: 'Project-specific', subsystemsCount: 0, componentsCount: 0,
            status: 'Active', image: vehicle.image
          });
          onNavigate(34);
        }, 900);
      },
    });
  };
  const visibleVehicles = VEHICLES.filter(v => v.name.toLowerCase().includes(query.toLowerCase()));



  return (
    <div className="lva-page">
      <header className="lva-header">
        <div className="lva-brand">
          <img src="/lifex-logo.png" alt="LIFEX" />
          <span>Lifecycle Intelligence for<br/>Engineering Excellence</span>
        </div>
        <label className="lva-search"><Search/><input placeholder="Search repositories, documents, components..." aria-label="Search"/></label>
        <div className="lva-header-actions">
          <button type="button" aria-label="Light mode"><Sun/></button>
          <button type="button" aria-label="Notifications" className="lva-bell"><Bell/><i/></button>
          <button type="button" className="lva-avatar">A</button><ChevronDown/>
        </div>
      </header>

      <main className="lva-main">
        <div className="lva-breadcrumb">
          <button type="button" onClick={() => onNavigate(4)}>Home</button><ChevronRight/>
          <span>Engineering Repository</span><ChevronRight/><strong>Project Repository</strong>
        </div>

        <section className="lva-intro">
          <div>
            <div className="lva-eyebrow"><span/> PROJECT REPOSITORY <span className="lva-eyebrow-line"/></div>
            <h1>Choose your <em>vehicle</em></h1>
            <p>Select a model to explore its architecture, components and lifecycle engineering knowledge.</p>
          </div>
          <div className="lva-step-summary">
            <span>STEP <b>02</b> / 05</span>
            <div className="lva-progress"><i/></div>
            <small>Vehicle selection</small>
          </div>
        </section>

        <section className="lva-flow" aria-label="Workflow progress">
          {[
            ['01','OEM','done'],['02','Vehicle','active'],['03','Overview',''],['04','Components',''],['05','Knowledge','']
          ].map(([num,label,state],i)=>(
            <React.Fragment key={num}>
              <div className={`lva-flow-step ${state}`}>
                <span>{state==='done'?<Check/>:num}</span><b>{label}</b>
              </div>
              {i<4 && <i className={`lva-flow-connector ${i===0?'passed':''}`}/>}
            </React.Fragment>
          ))}
        </section>

        <section className="lva-selection">
          <div className="lva-selection-head">
            <div>
              <div className="lva-kicker">AVAILABLE MODELS</div>
              <h2>Select a model</h2>
              <p>Choose a {oe} vehicle to continue to the engineering overview.</p>
            </div>
            <label className="lva-filter"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter vehicles"/></label>
          </div>

          <div className="lva-layout">
            <aside className="lva-oem-panel lva-live-hierarchy">
              <div className="lva-hierarchy-heading"><span>SELECTION HIERARCHY</span><i/></div>
              <div className="lva-hierarchy-node lva-hierarchy-oem lva-hierarchy-arrival">
                <div className="lva-hierarchy-logo"><img src={`/oem-logos/${oe.toLowerCase()}.svg`} alt={`${oe} logo`}/></div>
                <div className="lva-hierarchy-copy"><strong>{oe}</strong><small>Selected manufacturer</small></div>
                <CircleCheck/>
              </div>
              <div className="lva-hierarchy-link"><span/></div>
              <div ref={hierarchyVehicleRef} className="lva-hierarchy-vehicle-slot">
                {vehicleConfirmed && selected ? (
                  <div className={`lva-hierarchy-node lva-hierarchy-vehicle ${vehicleArriving?'arriving':''}`}>
                    <div className="lva-hierarchy-vehicle-icon"><CarFront/></div>
                    <div className="lva-hierarchy-copy"><strong>{selected.name}</strong><small>Selected vehicle · {selected.type}</small></div>
                    <CircleCheck/>
                  </div>
                ) : (
                  <div className="lva-hierarchy-placeholder"><CarFront/><span>{selectionInProgress?'Vehicle is travelling into hierarchy…':<>Choose a vehicle<br/>to add it here</>}</span></div>
                )}
              </div>
              <div className="lva-oem-status"><CircleCheck/> OEM confirmed</div>
              <button type="button" onClick={()=>onNavigate(35)}><ArrowLeftRight/> Change OEM</button>
              <div className="lva-oem-foot">PROJECT CONTEXT<br/><strong>{project.name || 'Engineering programme'}</strong></div>
            </aside>

            <div className="lva-vehicle-grid">
              {visibleVehicles.map(vehicle=>{
                const index=VEHICLES.findIndex(v=>v.name===vehicle.name);
                const active=selectedIndex===index;
                return (
                  <button type="button" key={vehicle.name} className={`lva-vehicle ${active?'chosen':''}`} onClick={(event)=>chooseVehicle(index, event.currentTarget)} aria-pressed={active} disabled={selectionInProgress}>
                    <div className="lva-vehicle-topline"><span>{vehicle.code}</span>{active?<span className="lva-vehicle-check" aria-label="Selected"><Check/></span>:<span className="lva-choose">SELECT MODEL <ArrowRight/></span>}</div>
                    <div className="lva-photo"><img src={vehicle.image} alt={`${oe} ${vehicle.name}`}/></div>
                    <div className="lva-vehicle-info">
                      <div><h3>{vehicle.name}</h3><p>{vehicle.tag}</p></div>
                      <span className="lva-type">{vehicle.type}</span>
                    </div>
                    <div className="lva-vehicle-bottom"><span><Gauge/>{vehicle.powertrain}</span><span>{vehicle.trim}</span></div>
                  </button>
                );
              })}
              {visibleVehicles.length===0 && <div className="lva-empty">No matching vehicle models.</div>}
            </div>
          </div>
        </section>

        <footer className="lva-footer">
          <div className="lva-current-selection"><Sparkles/><span>SELECTED MODEL</span><strong>{selected ? `${oe} ${selected.name}` : 'Choose a vehicle'}</strong></div>
          <div className="lva-footer-actions">
            <button type="button" className="lva-back" onClick={()=>onNavigate(35)}><ArrowLeft/> Back</button>

          </div>
        </footer>
      </main>
    </div>
  );
};
