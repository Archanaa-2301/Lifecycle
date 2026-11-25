import React, { useRef, useState } from 'react';
import { ArrowLeft, Search, CarFront, Check } from 'lucide-react';
import './OEMSelectionPage.css';
import { runSelectionFlight } from '../utils/selectionMotion';

type Props = { onBack: () => void; onSelectOEM: (oem: string) => void };

const OEMS = [
  { name: 'Toyota', description: 'Reliable passenger and utility vehicles', models: 'Innova · Fortuner · Camry · Glanza' },
  { name: 'Ford', description: 'Passenger vehicles and performance platforms', models: 'Endeavour · EcoSport · Mustang' },
  { name: 'BMW', description: 'Premium vehicles and performance engineering', models: '3 Series · 5 Series · X5' },
  { name: 'Honda', description: 'Passenger vehicles and hybrid platforms', models: 'City · Amaze · Elevate' },
  { name: 'Tesla', description: 'Electric vehicles and energy systems', models: 'Model 3 · Model Y · Model S' },
];

export const OEMSelectionPage: React.FC<Props> = ({ onBack, onSelectOEM }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [travelling, setTravelling] = useState<string | null>(null);
  const hierarchyOemRef = useRef<HTMLDivElement>(null);
  const filtered = OEMS.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));
  const choose = (name: string, source: HTMLButtonElement) => {
    if (travelling) return;
    setSelected(name);
    setTravelling(name);
    runSelectionFlight(source, {
      title: name,
      subtitle: 'OEM SELECTED',
      imageSrc: `/oem-logos/${name.toLowerCase()}.svg`,
      targetElement: hierarchyOemRef.current,
      targetLabel: 'SELECTION HIERARCHY',
      target: { left: 28, top: Math.round(window.innerHeight * .43), width: 246, height: 76 },
      duration: 1120,
      onComplete: () => { window.setTimeout(() => onSelectOEM(name), 420); },
    });
  };

  return (
    <div className="oem-select-page oem-reference-match">
      <main className="oem-select-main">
        <nav className="oem-select-progress" aria-label="Project workflow">
          {['Select OEM','Select Vehicle','Vehicle Overview','Component Selection','Knowledge Access'].map((step,i)=>(
            <div className={`oem-progress-item ${i===0?'active':''}`} key={step}>
              <span>{i+1}</span><b>{step}</b>
            </div>
          ))}
        </nav>

        <section className="oem-select-content">
          <div className="oem-select-content-head">
            <div>
              <div className="oem-select-eyebrow">AVAILABLE MANUFACTURERS</div>
              <h1>Choose your OEM</h1>
              <p>Select a manufacturer to continue to vehicle selection.</p>
            </div>
            <label className="oem-select-search">
              <Search aria-hidden="true" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search manufacturers" aria-label="Search manufacturers" />
            </label>
          </div>

          <div className="oem-selection-layout">
            <aside className={`oem-hierarchy-landing ${selected ? 'has-selection' : ''}`} ref={hierarchyOemRef} aria-live="polite">
              <span className="oem-hierarchy-kicker">SELECTION HIERARCHY</span>
              {selected ? <div className="oem-hierarchy-selected"><img src={`/oem-logos/${selected.toLowerCase()}.svg`} alt=""/><span><strong>{selected}</strong><small>Selected manufacturer</small></span><i><Check/></i></div> : <div className="oem-hierarchy-empty">Choose an OEM card. It will travel here and lock into the hierarchy.</div>}
              <div className="oem-hierarchy-next"><span>↓</span><small>VEHICLE SELECTION NEXT</small></div>
            </aside>
            <div className="oem-select-grid">
            {filtered.map((oem,index)=>(
              <button
                type="button"
                key={oem.name}
                className={`oem-choice ${selected===oem.name?'selected':''}`}
                style={{animationDelay:`${index*90}ms`}}
                onClick={(event)=>choose(oem.name, event.currentTarget)}
                aria-label={`Select ${oem.name} and continue to vehicle selection`}
                aria-pressed={selected===oem.name}
                disabled={!!travelling}
              >
                <div className="oem-choice-top">
                  <span>OEM / {oem.name.toUpperCase()}</span>
                  {selected===oem.name && <i className="oem-choice-check"><Check/></i>}
                </div>
                <div className="oem-choice-mark">
                  <img src={`/oem-logos/${oem.name.toLowerCase()}.svg`} alt={`${oem.name} logo`} />
                </div>
                <h2>{oem.name}</h2>
                <p>{oem.description}</p>
                <div className="oem-choice-models"><CarFront aria-hidden="true"/><span>{oem.models}</span></div>
              </button>
            ))}
            {filtered.length===0&&<div className="oem-select-empty">No manufacturers match your search.</div>}
            </div>
          </div>
        </section>
        <footer className="oem-select-footer">
          <button type="button" className="oem-back" onClick={onBack}><ArrowLeft/> Back to Repository</button>
          <span className="oem-select-hint">Select any manufacturer card to continue</span>
        </footer>
      </main>
    </div>
  );
};
