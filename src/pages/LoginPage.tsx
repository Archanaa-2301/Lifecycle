import React, { useEffect, useState } from 'react';
import type { PageId } from '../types/lifex';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Layers3, LockKeyhole, Mail, ShieldCheck, Workflow } from 'lucide-react';
import './lifex-login-white.css';

interface LoginPageProps { onNavigate: (page: PageId) => void; }

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [entering, setEntering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.classList.add('lifex-login-white-active');
    return () => document.body.classList.remove('lifex-login-white-active');
  }, []);

  const enterWorkspace = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setMessage('');
    if (event && (!email.trim() || !password.trim())) {
      setMessage('Enter your work email and password to continue.');
      return;
    }
    setEntering(true);
    window.setTimeout(() => onNavigate(4), 650);
  };

  return (
    <main className={`lifex-login-white ${entering ? 'is-entering' : ''}`}>
      <header className="lifex-login-white-header">
        <img src="/lifex-logo.png" alt="LIFEX — Lifecycle Intelligence For Engineering Excellence" />
        <div className="lifex-login-white-header-actions"><button type="button" onClick={() => onNavigate(1)} className="lifex-login-back"><ArrowLeft size={15}/> Back to Home</button><span className="lifex-login-white-secure"><ShieldCheck size={15}/> SECURE ENGINEERING WORKSPACE</span></div>
      </header>
      <div className="lifex-login-white-layout">
        <section className="lifex-login-white-showcase">
          <div className="lifex-login-white-eyebrow"><i/> AUTOMOTIVE ENGINEERING INTELLIGENCE</div>
          <h1>One connected space.<br/><em>Every engineering decision.</em></h1>
          <p>Bring vehicle programmes, component knowledge and verified engineering information together across the lifecycle.</p>
          <div className="lifex-login-white-car">
            <div className="lifex-login-white-meta"><span>VEHICLE SYSTEMS / DESIGN INTELLIGENCE</span><b>LXF — 01</b></div>
            <img src="/lifex-transparent-suv-hero.png" alt="High-resolution transparent silver SUV with visible suspension and chassis engineering"/>
            <div className="lifex-login-white-meta"><span>CONNECTED ENGINEERING DATA</span><span>01 / 04</span></div>
          </div>
          <div className="lifex-login-white-benefits">
            <span><Layers3/> Centralised repositories</span>
            <span><Workflow/> Connected intelligence</span>
            <span><CheckCircle2/> Verified knowledge</span>
          </div>
        </section>
        <section className="lifex-login-white-form-side">
          <form className="lifex-login-white-card" onSubmit={enterWorkspace}>
            <div className="lifex-login-white-lock"><LockKeyhole/></div>
            <div className="lifex-login-white-kicker">WELCOME BACK</div>
            <h2>Sign in to LIFEX</h2>
            <p>Access your engineering workspace securely.</p>
            <label htmlFor="lifex-login-email">Work email</label>
            <div className="lifex-login-white-field"><Mail/><input id="lifex-login-email" type="email" autoComplete="username" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
            <label htmlFor="lifex-login-password">Password</label>
            <div className="lifex-login-white-field"><LockKeyhole/><input id="lifex-login-password" type={showPassword?'text':'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?'Hide':<Eye size={17}/>}</button></div>
            <div className="lifex-login-white-options"><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Remember me</label><button type="button" onClick={()=>setMessage('Please contact your LIFEX administrator to reset your password.')}>Forgot password?</button></div>
            {message && <p className="lifex-login-white-message" role="status">{message}</p>}
            <button className="lifex-login-white-submit" type="submit" disabled={entering}><span>{entering?'Entering workspace':'Sign in'}</span><ArrowRight/></button>
            <div className="lifex-login-white-divider"><span/> SECURE ACCESS <span/></div>
            <div className="lifex-login-white-note"><ShieldCheck/> Your engineering data stays within your authorised workspace.</div>
          </form>
          <div className="lifex-login-white-help">Need access? <button type="button" onClick={()=>setMessage('Contact your LIFEX workspace administrator for access.')}>Request workspace access</button></div>
        </section>
      </div>
      <footer className="lifex-login-white-footer"><span>© 2026 LIFEX · Lifecycle Intelligence For Engineering Excellence</span><span>DESIGNED FOR ENGINEERING TEAMS</span></footer>
      {entering && <div className="lifex-login-white-overlay"><img src="/lifex-logo.png" alt="LIFEX"/><i/><span>CONNECTING TO LIFEX WORKSPACE</span></div>}
    </main>
  );
};
