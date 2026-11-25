import React, { useMemo, useState } from 'react';
import type { PageId } from '../types/lifex';
import {
  ArrowLeft, ArrowRight, Check, Layers3, Search,
} from 'lucide-react';
import './LifexKnowledgePages.css';
import { runSelectionFlight } from '../utils/selectionMotion';

type Props = {
  onNavigate: (page: PageId) => void;
  onSelectComponent: (index: number, name: string) => void;
};

// The labels follow the supplied component-hierarchy reference. Rodline is
// connected to the existing Rod Guide engineering record in componentKnowledge.
const hierarchyParts = [
  { name: 'Rebound Bumper', index: 0, image: '/rebound-bumper-real.webp', detail: 'Progressive end-stop cushion' },
  { name: 'Rod', index: 2, image: '/rod.png', detail: 'Damper piston-rod interface' },
  { name: 'Rodline', index: 1, image: '/rod-guide.png', detail: 'Rod guidance and alignment' },
  { name: 'Spring Seat', index: 3, image: '/spring-seat.png', detail: 'Coil-spring support interface' },
  { name: 'Top Mount', index: 4, image: '/top-mount.png', detail: 'Upper body attachment' },
  { name: 'Bumper Cap', index: 5, image: '/bumper-cap.png', detail: 'Protective bumper cover' },
];

export const RearSuspensionComponentSelectionPage: React.FC<Props> = ({ onNavigate, onSelectComponent }) => {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [selectionInProgress, setSelectionInProgress] = useState(false);
  const filteredParts = useMemo(() => hierarchyParts.filter(part => `${part.name} ${part.detail}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const selected = hierarchyParts[active];

  const choosePart = (originalIndex: number, source: HTMLButtonElement) => {
    if (selectionInProgress) return;
    const part = hierarchyParts[originalIndex];
    setSelectionInProgress(true);
    runSelectionFlight(source, {
      title: part.name,
      subtitle: 'COMPONENT SELECTED',
      imageSrc: part.image,
      targetElement: document.querySelector<HTMLElement>('.lk-active-component'),
      duration: 930,
      onComplete: () => {
        setActive(originalIndex);
        localStorage.setItem('lifex-selected-component-label', part.name);
        // Choosing a component card is the action that opens its knowledge workspace.
        onSelectComponent(part.index, part.name);
      },
    });
  };



  return (
    <main className="lk-page lk-hierarchy-page">
      <div className="lk-shell">
        <div className="lk-hierarchy-intro">
          <p>Explore the hierarchy and relationships between the selected system and its components.</p>
          <strong>Toyota Innova · Rear Suspension</strong>
        </div>

        <div className="lk-step-strip" aria-label="Project repository progress">
          <span className="done"><Check /> Select OEM</span><b />
          <span className="done"><Check /> Select Vehicle</span><b />
          <span className="done"><Check /> Vehicle Overview</span><b />
          <span className="current"><i>4</i> Component Hierarchy</span><b />
          <span><i>5</i> Knowledge Access</span>
        </div>

        <section className="lk-hierarchy-layout">
          <aside className="lk-lineage-card">
            <div className="lk-card-eyebrow">OEM TO COMPONENT</div>
            <div className="lk-lineage-node lk-oem-node">
              <img src="/oem-logos/toyota.svg" alt="Toyota" />
              <strong>Toyota</strong><small>Original Equipment Manufacturer</small>
            </div>
            <div className="lk-lineage-arrow"><ArrowRight /></div>
            <div className="lk-lineage-node lk-vehicle-node">
              <img src="/images/innova-cutaway-highres.png" alt="Toyota Innova" />
              <div><strong>Innova</strong><small>MPV · Selected vehicle</small></div>
            </div>
            <div className="lk-lineage-arrow"><ArrowRight /></div>
            <div className="lk-lineage-node lk-system-node">
              <img src="/rear-suspension-innova-assembly.png" alt="Rear suspension assembly" />
              <div><strong>Rear Suspension</strong><small>Selected system</small></div>
              <span className="lk-selected-tag"><Check /> Selected</span>
            </div>
            <div className="lk-lineage-foot"><span /> OEM and vehicle selection confirmed</div>
          </aside>

          <section className="lk-map-card">
            <div className="lk-map-header">
              <div><span className="lk-card-eyebrow">ASSEMBLY RELATIONSHIP MAP</span><h2>Rear Suspension Components</h2><p>Select a component node to inspect its engineering knowledge.</p></div>
              <label className="lk-search"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a component" /></label>
            </div>

            <div className="lk-map-canvas lk-map-canvas-branch-only">
              <div className="lk-relationship-area lk-relationship-area-rooted">
                <div className="lk-hierarchy-root">
                  <span className="lk-root-icon"><Layers3 /></span>
                  <span><small>SELECTED SYSTEM</small><strong>Rear Suspension</strong><em>6 connected components</em></span>
                  <i className="lk-root-live-dot" />
                </div>
                <svg className="lk-connectors lk-branch-connectors" viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <marker id="lk-branch-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0 0 L6 3 L0 6" fill="none" stroke="#2475f4" strokeWidth="1.25" />
                    </marker>
                  </defs>
                  <path className="lk-branch-path lk-branch-trunk" style={{ animationDelay: '180ms' }} d="M0 170 H175 V85 M175 170 V255" />
                  <path className="lk-branch-path" style={{ animationDelay: '380ms' }} d="M175 85 H225" markerEnd="url(#lk-branch-arrow)" />
                  <path className="lk-branch-path" style={{ animationDelay: '520ms' }} d="M175 85 H500" markerEnd="url(#lk-branch-arrow)" />
                  <path className="lk-branch-path" style={{ animationDelay: '660ms' }} d="M175 85 H825" markerEnd="url(#lk-branch-arrow)" />
                  <path className="lk-branch-path" style={{ animationDelay: '800ms' }} d="M175 255 H225" markerEnd="url(#lk-branch-arrow)" />
                  <path className="lk-branch-path" style={{ animationDelay: '940ms' }} d="M175 255 H500" markerEnd="url(#lk-branch-arrow)" />
                  <path className="lk-branch-path" style={{ animationDelay: '1080ms' }} d="M175 255 H825" markerEnd="url(#lk-branch-arrow)" />
                  <circle className="lk-branch-junction" cx="175" cy="170" r="6" />
                  <circle className="lk-branch-junction" cx="175" cy="85" r="5" />
                  <circle className="lk-branch-junction" cx="175" cy="255" r="5" />
                </svg>
                <div className="lk-component-grid">
                  {filteredParts.map(part => {
                    const originalIndex = hierarchyParts.findIndex(item => item.index === part.index);
                    return <button type="button" key={part.name} style={{ animationDelay: `${1450 + originalIndex * 150}ms`, ['--node-delay' as any]: `${1450 + originalIndex * 150}ms` }} className={`lk-component-node lk-branch-node ${active === originalIndex ? 'active' : ''}`} onClick={(event) => choosePart(originalIndex, event.currentTarget)} aria-pressed={active === originalIndex} disabled={selectionInProgress}>
                      <span className="lk-node-image"><img src={part.image} alt="" /></span>
                      <span className="lk-node-copy"><strong>{part.name}</strong><small>{part.detail}</small></span>
                      {active === originalIndex && <span className="lk-node-check"><Check /></span>}
                    </button>;
                  })}
                  {filteredParts.length === 0 && <div className="lk-empty">No components match “{query}”.</div>}
                </div>
              </div>
            </div>

            <div className="lk-map-footer">
              <div className="lk-active-component"><span className="lk-active-dot"/><span><small>SELECTED COMPONENT</small><strong>{selected.name}</strong></span><em>{selected.detail}</em></div>

            </div>
          </section>
        </section>

        <footer className="lk-footer">
          <button type="button" className="lk-secondary-button" onClick={() => onNavigate(34)}><ArrowLeft /> Back to Vehicle Overview</button>
          <span>TOYOTA INNOVA <b>·</b> REAR SUSPENSION <b>·</b> COMPONENT HIERARCHY</span>

        </footer>
      </div>
    </main>
  );
};

export default RearSuspensionComponentSelectionPage;
