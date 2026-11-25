import React, { useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, FolderKanban, GitBranch, Mail, MessageSquareText, ShieldCheck, ClipboardList, ArrowLeft } from 'lucide-react';
import type { PageId } from '../types/lifex';
import { COMPONENTS } from './componentKnowledge';
import EngineeringIntelligenceExtraction from './EngineeringIntelligenceExtraction';
import './LifexKnowledgePages.css';

interface Props { componentIndex: number; onNavigate: (page: PageId) => void; }
type RepositoryName = 'Know-How' | 'Project Management' | 'Change Management' | 'Warranty / Field Return / Failure';
const REPOSITORIES: { name: RepositoryName; icon: React.ReactNode; description: string }[] = [
  { name: 'Know-How', icon: <BookOpen />, description: 'Design knowledge, engineering guidelines and technical references' },
  { name: 'Project Management', icon: <FolderKanban />, description: 'Project plans, reviews, milestones and delivery records' },
  { name: 'Change Management', icon: <GitBranch />, description: 'Engineering changes, approvals and configuration history' },
  { name: 'Warranty / Field Return / Failure', icon: <ShieldCheck />, description: 'Field returns, failure analysis and corrective actions' },
];

export const ComponentWorkspacePage: React.FC<Props> = ({ componentIndex, onNavigate }) => {
  const part = COMPONENTS[componentIndex] || COMPONENTS[0];
  const [showAI, setShowAI] = useState(false);
  const openRepository = (name: RepositoryName) => {
    localStorage.setItem('lifex-selected-repository', name);
    onNavigate(31);
  };
  if (showAI) return <EngineeringIntelligenceExtraction initialTab="emails" onBack={() => setShowAI(false)} componentName={part.name} />;
  return <main className="lk-page lk-workspace-page">
    <div className="lk-workspace-shell">
      <header className="lk-workspace-heading">
        <div className="lk-workspace-heading-icon"><ClipboardList /></div>
        <div><span className="lk-workspace-kicker">COMPONENT WORKSPACE</span><h1>{part.name}</h1><p>Select a workflow to access, create or extract engineering knowledge for this component.</p></div>
      </header>
      <section className="lk-workspace-grid">
        <article className="lk-workspace-card lk-component-summary-card lk-selection-path-card" style={{'--card-delay':'80ms'} as React.CSSProperties}>
          <div className="lk-selection-path-heading"><span>SELECTION HIERARCHY</span><span className="lk-path-live-dot" /></div>
          <div className="lk-selection-path-list">
            <div className="lk-selection-path-node lk-path-parent">
              <div className="lk-path-thumb lk-path-toyota"><img src="/oem-logos/toyota.svg" alt="Toyota" /></div>
              <div className="lk-path-copy"><strong>Toyota</strong><small>Original Equipment Manufacturer</small></div>
              <CheckCircle2 className="lk-path-check" />
            </div>
            <div className="lk-path-connector"><span /></div>
            <div className="lk-selection-path-node">
              <div className="lk-path-thumb"><img src="/images/innova-cutaway-highres.png" alt="Toyota Innova" /></div>
              <div className="lk-path-copy"><strong>Innova</strong><small>Selected vehicle · MPV</small></div>
              <CheckCircle2 className="lk-path-check" />
            </div>
            <div className="lk-path-connector"><span /></div>
            <div className="lk-selection-path-node">
              <div className="lk-path-thumb"><img src="/rear-suspension-innova-assembly.png" alt="Rear Suspension" /></div>
              <div className="lk-path-copy"><strong>Rear Suspension</strong><small>Selected vehicle system</small></div>
              <CheckCircle2 className="lk-path-check" />
            </div>
            <div className="lk-path-connector"><span /></div>
            <div className="lk-selection-path-node lk-path-current">
              <div className="lk-path-thumb"><img src={componentIndex === 0 ? '/rebound-bumper-real.webp' : componentIndex === 1 ? '/rod-guide.png' : componentIndex === 2 ? '/rod.png' : componentIndex === 3 ? '/spring-seat.png' : componentIndex === 4 ? '/top-mount.png' : '/bumper-cap.png'} alt={part.name} /></div>
              <div className="lk-path-copy"><strong>{part.name}</strong><small>Selected component · {part.group}</small></div>
              <span className="lk-path-selected">SELECTED</span>
            </div>
          </div>
          <div className="lk-path-component-description"><p>{part.purpose}</p></div>
          <div className="lk-context-active"><CheckCircle2 /> Component context active</div>
        </article>
        <article className="lk-workspace-card lk-repository-choice-card" style={{'--card-delay':'180ms'} as React.CSSProperties}>
          <div className="lk-workspace-card-icon"><BookOpen /></div><h2>Knowledge Repository</h2><p className="lk-workspace-card-desc">Access structured engineering knowledge and past records for {part.name}.</p>
          <div className="lk-workflow-list">
            {REPOSITORIES.map((repo, index) => <button key={repo.name} className="lk-workflow-row" style={{'--row-delay':`${index * 70}ms`} as React.CSSProperties} onClick={() => openRepository(repo.name)}><span>{repo.icon}</span><span className="lk-workflow-copy"><strong>{repo.name}</strong><small>{repo.description}</small></span><ArrowRight /></button>)}
          </div>
          <button className="lk-workspace-primary" onClick={() => openRepository('Know-How')}>Explore Repository <ArrowRight /></button>
        </article>
        <article className="lk-workspace-card lk-ai-choice-card" style={{'--card-delay':'280ms'} as React.CSSProperties}>
          <div className="lk-workspace-card-icon"><BrainCircuit /></div><h2>Engineering Intelligence Extraction</h2><p className="lk-workspace-card-desc">Extract engineering knowledge from various sources using AI for {part.name}.</p>
          <div className="lk-extraction-choice-list">
            <button className="lk-workflow-row" onClick={() => setShowAI(true)}><span><Mail /></span><span className="lk-workflow-copy"><strong>Emails / Communication Threads</strong><small>Extract decisions, actions and technical context</small></span><ArrowRight /></button>
            <button className="lk-workflow-row" onClick={() => setShowAI(true)}><span><MessageSquareText /></span><span className="lk-workflow-copy"><strong>Meeting Minutes / Discussions</strong><small>Structure discussions into reusable knowledge</small></span><ArrowRight /></button>
          </div>
          <button className="lk-workspace-primary" onClick={() => setShowAI(true)}>Extract Intelligence <ArrowRight /></button>
        </article>
      </section>
      <section className="lk-how-it-works"><h3>How it Works</h3><div className="lk-how-step"><i>1</i><span>Choose a workflow</span></div><ArrowRight/><div className="lk-how-step"><i>2</i><span>Provide input (view / submit / upload)</span></div><ArrowRight/><div className="lk-how-step"><i>3</i><span>AI processes &amp; structures knowledge</span></div><ArrowRight/><div className="lk-how-step"><i>4</i><span>Review, save and reuse</span></div></section>
      <footer className="lk-workspace-footer"><button onClick={() => onNavigate(11)}><ArrowLeft/> Back to Component Hierarchy</button><span>TOYOTA INNOVA <b>·</b> REAR SUSPENSION <b>·</b> {part.name.toUpperCase()}</span></footer>
    </div>
  </main>;
};
export default ComponentWorkspacePage;
