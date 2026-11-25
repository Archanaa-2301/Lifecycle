import React from 'react';
import { ArrowRight, Play, UserRound, Layers3, Network, ShieldCheck, RefreshCw } from 'lucide-react';
import { PageId } from '../types/lifex';
import '../styles/lifex-reference-home.css';

interface LandingPageProps { onNavigate: (page: PageId) => void; }

const lifecycleCards = [
  { title: 'Design & Development', text: 'Capture design intent, analysis and validation results', image: '/lifecycle-cards/design-development.webp', alt: 'Automotive suspension assembly with coil spring', target: 7 },
  { title: 'Manufacturing & Quality', text: 'Process, quality and compliance knowledge', image: '/lifecycle-cards/manufacturing-quality.webp', alt: 'Brake disc and hub assembly', target: 8 },
  { title: 'Service & Maintenance', text: 'Field insights, issues and resolution records', image: '/lifecycle-cards/service-maintenance.webp', alt: 'Vehicle body and chassis structure', target: 15 },
  { title: 'End-of-Life & Sustainability', text: 'Reuse, recycling and lifecycle learnings', image: '/lifecycle-cards/end-of-life-sustainability.webp', alt: 'Green recycling symbol', target: 16 },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeNav, setActiveNav] = React.useState('Home');

  React.useEffect(() => {
    const root = document.querySelector('.lifex-reference-home');
    if (!root) return;

    const revealTargets = root.querySelectorAll(
      '.lifex-ref-copy, .lifex-ref-vehicle, .lifex-ref-life-card, .lifex-ref-about'
    );
    revealTargets.forEach((el, index) => {
      el.classList.add('lifex-scroll-reveal');
      (el as HTMLElement).style.setProperty('--lifex-reveal-delay', `${Math.min(index % 4, 3) * 110}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lifex-in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

    revealTargets.forEach((el) => observer.observe(el));

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.setAttribute('style', `--lifex-page-scroll: ${Math.min(1, Math.max(0, progress))}`);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);
  const nav = (name: string) => {
    setActiveNav(name);
    if (name === 'Platform') onNavigate(4);
    if (name === 'Repositories') onNavigate(15);
    if (name === 'Use Cases') onNavigate(16);
    if (name === 'About') document.getElementById('lifex-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lifex-landing lifex-reference-home">
      <div className="lifex-ref-scroll-progress" aria-hidden="true" />
      <header className="lifex-ref-nav">
        <a className="lifex-ref-brand" href="#top" aria-label="LIFEX Home">
          <img src="/lifex-logo.png" alt="LIFEX — Lifecycle Engineering Exchange" />
          <span>Lifecycle Engineering Exchange</span>
        </a>
        <nav aria-label="Main navigation">
          {['Home', 'Platform', 'Repositories', 'Use Cases', 'About'].map((item) => (
            <button key={item} className={activeNav === item ? 'active' : ''} onClick={() => nav(item)} type="button">{item}</button>
          ))}
        </nav>
        <div className="lifex-ref-actions">
          <button className="lifex-ref-login" onClick={() => onNavigate(3)} type="button"><UserRound size={16}/> Log In</button>
          <button className="lifex-ref-cta" onClick={() => onNavigate(3)} type="button">Get Started <ArrowRight size={18}/></button>
        </div>
      </header>

      <main id="top">
        <section className="lifex-ref-hero">
          <div className="lifex-ref-copy">
            <div className="lifex-ref-eyebrow"><i/>AUTOMOTIVE ENGINEERING KNOWLEDGE PLATFORM</div>
            <div className="lifex-ref-wordmark">LIFEX</div>
            <h1>Lifecycle Intelligence<br/>for Engineering Excellence</h1>
            <p>A unified platform to capture, organise and reuse verified engineering information across programs, components and vehicle lifecycles.</p>
            <div className="lifex-ref-buttons">
              <button className="lifex-ref-cta" onClick={() => onNavigate(3)} type="button">Get Started <ArrowRight size={19}/></button>
              <button className="lifex-ref-learn" onClick={() => document.getElementById('lifex-about')?.scrollIntoView({ behavior: 'smooth' })} type="button"><Play size={17}/> Learn More</button>
            </div>
            <div className="lifex-ref-points">
              <div><Layers3/><b>Centralised<br/>Repositories</b></div>
              <div><Network/><b>Component &amp;<br/>System Intelligence</b></div>
              <div><ShieldCheck/><b>Verified<br/>Engineering Content</b></div>
              <div><RefreshCw/><b>Lifecycle<br/>Knowledge Reuse</b></div>
            </div>
          </div>

          <div className="lifex-ref-vehicle" aria-label="Transparent SUV showing suspension and chassis">
            <div className="lifex-ref-orbit"/>
            <img src="/lifex-transparent-suv-hero.png" alt="Transparent silver SUV showing suspension, chassis, wheels and mechanical assemblies" />
              <div className="lifex-ref-vehicle-caption">ENGINEERED KNOWLEDGE. CONNECTED LIFECYCLE.</div>
          </div>
        </section>

        <section className="lifex-ref-lifecycle" aria-label="Lifecycle capabilities">
          {lifecycleCards.map(({ title, text, image, alt, target }) => (
            <button className="lifex-ref-life-card" key={title} onClick={() => onNavigate(target as PageId)} type="button">
              <span className="lifex-ref-life-icon"><img src={image} alt={alt} /></span>
              <span className="lifex-ref-life-copy"><b>{title}</b><small>{text}</small></span>
              <span className="lifex-ref-life-arrow"><ArrowRight size={17}/></span>
            </button>
          ))}
        </section>

        <section className="lifex-ref-about" id="lifex-about">
          <span>ABOUT LIFEX</span><h2>One connected engineering knowledge platform.</h2>
          <p>Connect vehicle systems, component intelligence, verified engineering content and lifecycle learnings across your organisation.</p>
        </section>
      </main>
    </div>
  );
};
