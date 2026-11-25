import React, { useMemo, useState } from 'react';
import {
  Home, Layers3, Folder, ChartNoAxesCombined, CircleHelp, Search, Bell, CarFront,
  ClipboardList, CalendarDays, Settings, ArrowLeft, ArrowRight, ChevronRight,
  Sun, Moon, X, Check
} from 'lucide-react';
import type { PageId } from '../types/lifex';
import './ProjectDetailsEntryPage.css';

type ProjectPreset = {
  id?: string;
  code?: string;
  name?: string;
  platform?: string;
  oems?: string[];
  projectType?: string;
  initiatedOn?: string;
  description?: string;
  image?: string;
};

interface Props { onNavigate: (page: PageId) => void; }

const workflow = [
  'Project Details',
  'Rear Suspension Components',
  'Component Workspace',
];

export const ProjectDetailsEntryPage: React.FC<Props> = ({ onNavigate }) => {
  const preset = useMemo<ProjectPreset | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('lifex-project-preset') || 'null') as ProjectPreset | null;
    } catch {
      return null;
    }
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    localStorage.getItem('lifex-project-details-theme') === 'light' ? 'light' : 'dark'
  );
  const [name, setName] = useState(preset?.name || '');
  const [code, setCode] = useState(preset?.code || preset?.id || '');
  const [platform, setPlatform] = useState(preset?.platform || 'EV Platform');
  const [projectType, setProjectType] = useState(preset?.projectType || 'Design Change');
  const [oems, setOems] = useState<string[]>(preset?.oems || []);
  const [description, setDescription] = useState(preset?.description || '');
  const [oemOpen, setOemOpen] = useState(false);
  const [error, setError] = useState('');

  const toggleOem = (value: string) => {
    setOems(current => current.includes(value)
      ? current.filter(item => item !== value)
      : current.length < 2 ? [...current, value] : current);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !code.trim() || !platform || oems.length === 0) {
      setError('Please complete the required project information.');
      return;
    }
    const details = {
      name: name.trim(), code: code.trim(), platform, projectType,
      oems, description: description.trim(),
      initiatedOn: preset?.initiatedOn || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    localStorage.setItem('lifex-active-project', JSON.stringify(details));
    onNavigate(5);
  };

  const changeTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('lifex-project-details-theme', next);
  };

  return (
    <div className={`lifex-project-details lifex-project-details-${theme}`}>
      <aside className="lpd-sidebar">
        <div className="lpd-brand">
          <img src="/lifex-logo.png" alt="LIFEX" />
          <span>Lifecycle Intelligence<br />For Engineering Excellence</span>
        </div>
        <nav className="lpd-nav">
          <button type="button" onClick={() => onNavigate(4)}><Home /><span>Dashboard</span></button>
          <button type="button" onClick={() => onNavigate(29)}><Layers3 /><span>Global Repository</span></button>
          <button type="button" className="selected"><Folder /><span>Project Repository</span></button>
          <button type="button"><ChartNoAxesCombined /><span>Reports &amp; Insights</span></button>
          <button type="button"><CircleHelp /><span>Help &amp; Support</span></button>
        </nav>
        <div className="lpd-sidebar-glow" />
      </aside>

      <div className="lpd-main">
        <header className="lpd-topbar">
          <div className="lpd-crumbs">
            <button type="button" onClick={() => onNavigate(4)} aria-label="Home"><Home /></button>
            <ChevronRight /><span>Project Repository</span><ChevronRight />
            <button type="button" onClick={() => onNavigate(30)}>Select Project</button>
            <ChevronRight /><strong>Project Details</strong>
          </div>
          <div className="lpd-top-actions">
            <button type="button" aria-label="Search"><Search /></button>
            <button type="button" aria-label="Notifications" className="lpd-notification"><Bell /><i /></button>
            <span className="lpd-avatar">A</span>
            <button type="button" aria-label="Toggle theme" onClick={changeTheme} className="lpd-theme-toggle">
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>

        <main className="lpd-content">
          <section className="lpd-heading">
            <div className="lpd-heading-icon"><ClipboardList /></div>
            <div>
              <h1>Project Details</h1>
              <p>View and confirm the project information before proceeding to vehicle selection.</p>
            </div>
            <img src="/lifex-wireframe-car.png" alt="" className="lpd-heading-car" />
          </section>

          <form onSubmit={submit}>
            <div className="lpd-layout">
              <aside className="lpd-summary-card">
                <div className="lpd-project-image">
                  <img src={preset?.image || '/rear-suspension-assembly.jpg'} alt="Project engineering assembly" />
                  <span className="lpd-image-accent" />
                </div>
                <div className="lpd-summary-body">
                  <h2>{name || 'Selected Project'}</h2>
                  <p className="lpd-project-code">{code || 'Project code pending'}</p>
                  <div className="lpd-summary-divider" />
                  <div className="lpd-summary-row"><Layers3 /><span>Program / Platform</span><strong>{platform || '—'}</strong></div>
                  <div className="lpd-summary-row"><CarFront /><span>OEMs</span><strong className="lpd-oem-chips">{oems.map(item => <i key={item}>{item}</i>)}</strong></div>
                  <div className="lpd-summary-row"><Settings /><span>Project Type</span><strong>{projectType}</strong></div>
                  <div className="lpd-summary-row"><CalendarDays /><span>Initiated On</span><strong>{preset?.initiatedOn || '18 Nov 2026'}</strong></div>
                </div>
              </aside>

              <section className="lpd-form-card">
                <h2><i />Project Information</h2>
                <div className="lpd-fields-grid">
                  <label className="lpd-field">
                    <span>Project Name <b>*</b></span>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" required />
                  </label>
                  <label className="lpd-field">
                    <span>Project Code <b>*</b></span>
                    <input value={code} onChange={e => setCode(e.target.value)} placeholder="Project code" required />
                  </label>
                  <label className="lpd-field">
                    <span>Program / Platform <b>*</b></span>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} required>
                      <option>EV Platform</option><option>ICE Platform</option><option>Hybrid Platform</option><option>Multi-Platform</option>
                    </select>
                  </label>
                  <div className="lpd-field lpd-oem-field">
                    <span>OEMs <b>*</b> <small>(Select up to 2)</small></span>
                    <button type="button" className="lpd-oem-select" onClick={() => setOemOpen(v => !v)}>
                      <span>{oems.length ? oems.map(item => <i key={item}>{item}<X onClick={e => { e.stopPropagation(); toggleOem(item); }} /></i>) : 'Select OEMs...'}</span>
                      <ChevronRight className={oemOpen ? 'rotated' : ''} />
                    </button>
                    {oemOpen && <div className="lpd-oem-menu">
                      {['Tata Motors','Kia','Hyundai','Mahindra','Maruti Suzuki','MG','BYD','Renault','Nissan'].map(item => (
                        <button type="button" key={item} onClick={() => toggleOem(item)}>
                          <span className={oems.includes(item) ? 'checked' : ''}>{oems.includes(item) && <Check />}</span>{item}
                        </button>
                      ))}
                    </div>}
                  </div>
                  <label className="lpd-field lpd-project-type">
                    <span>Project Type <b>*</b></span>
                    <select value={projectType} onChange={e => setProjectType(e.target.value)}>
                      <option>Design Change</option><option>New Development</option><option>Cost Reduction</option><option>Quality Improvement</option><option>Validation / Testing</option>
                    </select>
                  </label>
                  <label className="lpd-field lpd-description">
                    <span>Project Description</span>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the project scope and objective..." rows={3} />
                  </label>
                </div>
                {error && <p className="lpd-error" role="alert">{error}</p>}
                <div className="lpd-form-actions">
                  <button type="button" className="lpd-cancel" onClick={() => onNavigate(30)}>Cancel</button>
                  <button type="submit" className="lpd-next">Next: OE & Vehicle Type <ArrowRight /></button>
                </div>
              </section>
            </div>
            <div className="lpd-workflow">
              {workflow.map((step, index) => (
                <div className={`lpd-workflow-step ${index === 0 ? 'current' : ''}`} key={step}>
                  <span>{index + 1}</span><strong>{step}</strong>
                </div>
              ))}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
