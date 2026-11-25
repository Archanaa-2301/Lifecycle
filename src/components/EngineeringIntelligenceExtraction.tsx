import React, { useState } from "react";
import { Home, CarFront, Layers, FolderKanban, ClipboardList, BookOpen, BrainCircuit, Mail, Users, ArrowRight, Database, Check, ChevronRight, ShieldCheck, Settings, Search, Bell } from "lucide-react";
import "./EngineeringIntelligenceExtraction.css";

type Message = { sender: string; recipient: string; date: string; initial: string; body: string };
type Email = { id: number; subject: string; sender: string; date: string; status: string; messages: Message[] };
type Meeting = { id: number; title: string; date: string; participants: string; transcript: string[] };

const emails: Email[] = [
  { id: 1, subject: "RB – Compression Set Issue", sender: "Kumar R. (LTTS)", date: "14 Oct 2026", status: "Resolved", messages: [
    { sender: "Kumar R. (LTTS)", recipient: "suspension.team@ltts.com", date: "14 Oct 2026, 10:24 AM", initial: "K", body: "We are observing higher compression set (~18%) in the latest Rebound Bumper (Batch B) against the specification limit of ≤ 15%. This may affect the long-term energy absorption performance. Request analysis on root cause and corrective action." },
    { sender: "Meera S. (Tenneco)", recipient: "Kumar R. (LTTS)", date: "15 Oct 2026, 02:17 PM", initial: "M", body: "Analysis indicates inadequate material drying before moulding as the probable root cause. Action: Implement controlled drying (100 °C, 4 h) and update the process document." },
    { sender: "Kumar R. (LTTS)", recipient: "Meera S. (Tenneco)", date: "16 Oct 2026, 11:03 AM", initial: "K", body: "Retest completed with the updated process. Compression set is now 12% (within ≤ 15% spec). The issue is resolved. Please close the ticket." }
  ]},
  { id: 2, subject: "RB – Material Hardness Clarification", sender: "Meera S. (Tenneco)", date: "10 Oct 2026", status: "Resolved", messages: [
    { sender: "Meera S. (Tenneco)", recipient: "suspension.team@ltts.com", date: "10 Oct 2026, 09:30 AM", initial: "M", body: "The latest Rebound Bumper sample shows a variation in hardness. Please verify the material grade and confirm the specified hardness range." },
    { sender: "Kumar R. (LTTS)", recipient: "Meera S. (Tenneco)", date: "10 Oct 2026, 02:15 PM", initial: "K", body: "The supplier material certificate was reviewed. The variation was traced to an incorrect test conditioning period. The inspection procedure has been updated." },
    { sender: "Meera S. (Tenneco)", recipient: "Kumar R. (LTTS)", date: "11 Oct 2026, 10:00 AM", initial: "M", body: "Updated samples have been verified. The hardness readings are within the illustrative acceptance range. Issue closed." }
  ]},
  { id: 3, subject: "RB – NVH Concern at Low Temp", sender: "Arun P. (LTTS)", date: "06 Oct 2026", status: "Resolved", messages: [
    { sender: "Arun P. (LTTS)", recipient: "suspension.team@ltts.com", date: "06 Oct 2026, 11:15 AM", initial: "A", body: "A noise concern has been reported during suspension rebound operation under low-temperature conditions. Please investigate the bumper response." },
    { sender: "Meera S. (Tenneco)", recipient: "Arun P. (LTTS)", date: "07 Oct 2026, 03:20 PM", initial: "M", body: "The team is reviewing the low-temperature material behaviour and the contact interface." },
    { sender: "Arun P. (LTTS)", recipient: "Meera S. (Tenneco)", date: "08 Oct 2026, 04:10 PM", initial: "A", body: "The revised interface configuration passed the illustrative follow-up evaluation. The reported concern is closed." }
  ]},
  { id: 4, subject: "RB – Dimensional Deviation (Batch B)", sender: "Supplier QC", date: "02 Oct 2026", status: "Resolved", messages: [
    { sender: "Supplier QC", recipient: "suspension.team@ltts.com", date: "02 Oct 2026, 10:00 AM", initial: "S", body: "Inspection identified a dimensional deviation in the latest Rebound Bumper batch. Please review the affected dimension and advise on disposition." },
    { sender: "Kumar R. (LTTS)", recipient: "Supplier QC", date: "03 Oct 2026, 01:30 PM", initial: "K", body: "The inspection method and mould setup have been reviewed. A mould adjustment and repeat inspection are requested." },
    { sender: "Supplier QC", recipient: "Kumar R. (LTTS)", date: "04 Oct 2026, 03:45 PM", initial: "S", body: "The adjusted samples passed the repeat inspection. The affected batch has been reviewed and the issue is closed." }
  ]}
];

const meetings: Meeting[] = [
  { id: 1, title: "Rebound Bumper Design Review", date: "12 Oct 2026", participants: "Kumar R., Meera S., Design Team", transcript: [
    "The team reviewed compression-set performance from the latest Rebound Bumper batch.",
    "The discussion focused on material conditioning, moulding parameters and the impact on long-term energy absorption.",
    "The team agreed to review the material drying process and document the proposed process controls."
  ]},
  { id: 2, title: "Rebound Bumper Validation Meeting", date: "16 Oct 2026", participants: "Kumar R., Supplier QC, Validation Team", transcript: [
    "The team reviewed the updated material drying process and the follow-up sample results.",
    "The reported compression-set result was discussed against the illustrative acceptance limit.",
    "The team agreed to retain the updated process record and close the discussion after engineering review."
  ]}
];

const nav = [
  [Home, "Engineering Home"], [CarFront, "Vehicle Explorer"], [Layers, "Component Repository"],
  [FolderKanban, "Knowledge Management"], [ClipboardList, "Knowledge Capture"],
  [ShieldCheck, "Working Limits"], [BookOpen, "Reference Design Library"],
  [Settings, "CAD Classification"], [Database, "SOR Management"], [BrainCircuit, "AI Assistant"]
] as const;

export default function EngineeringIntelligenceExtraction() {
  const [tab, setTab] = useState<"emails" | "meetings">("emails");
  const [emailId, setEmailId] = useState(1);
  const [meetingId, setMeetingId] = useState(1);
  const [search, setSearch] = useState("");
  const [stored, setStored] = useState<string[]>([]);
  const email = emails.find(x => x.id === emailId) ?? emails[0];
  const meeting = meetings.find(x => x.id === meetingId) ?? meetings[0];
  const filteredEmails = emails.filter(x => `${x.subject} ${x.sender}`.toLowerCase().includes(search.toLowerCase()));
  const filteredMeetings = meetings.filter(x => `${x.title} ${x.participants}`.toLowerCase().includes(search.toLowerCase()));
  const reportId = `${tab}-${tab === "emails" ? email.id : meeting.id}`;
  const isStored = stored.includes(reportId);

  function storeReport() {
    setStored(current => current.includes(reportId) ? current : [...current, reportId]);
  }

  return <div className="lifex-app">
    <aside className="lifex-sidebar">
      <div className="lifex-logo">LIFEX</div>
      <nav>{nav.map(([Icon, label]) => <button key={label} className={`sidebar-item ${label === "Knowledge Management" ? "active" : ""}`} type="button"><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-decoration">ENGINEERING INTELLIGENCE</div>
    </aside>

    <main className="lifex-main">
      <header className="lifex-topbar">
        <div className="topbar-brand"><b className="brand-name">LIFEX</b><span>Lifecycle Intelligence for Engineering Excellence</span></div>
        <label className="top-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search across engineering knowledge..."/></label>
        <button className="icon-button" aria-label="Notifications" type="button"><Bell size={19}/><i/></button>
        <div className="user-profile"><b>AM</b><span><strong>Archanaa M</strong><small>Engineering</small></span><ChevronRight size={15}/></div>
      </header>

      <section className="workspace">
        <div className="breadcrumb"><Home size={14}/> Component Workspace <ChevronRight size={13}/> Rebound Bumper <ChevronRight size={13}/><strong>Engineering Intelligence Extraction</strong></div>
        <div className="page-heading">
          <div className="heading-icon"><BrainCircuit size={33}/></div>
          <div className="heading-copy"><h1>Engineering Intelligence Extraction</h1><p>Extract and create engineering reports from emails and meeting transcripts for Rebound Bumper.</p></div>
          <div className="component-card"><div className="bumper-icon"><i/><i/><i/><i/></div><div><strong>Rebound Bumper</strong><small>RB-001&nbsp; | &nbsp;Suspension System</small></div><span>CORE COMPONENT</span></div>
        </div>

        <div className="workflow-row">
          <div className="source-tabs">
            <button type="button" className={tab === "emails" ? "selected" : ""} onClick={() => setTab("emails")}><Mail size={22}/> Emails (4)</button>
            <button type="button" className={tab === "meetings" ? "selected" : ""} onClick={() => setTab("meetings")}><Users size={22}/> Meetings (2)</button>
          </div>
          <div className="steps"><div className="current"><b>1</b><span>Select Source</span></div><i/><div><b>2</b><span>Extract &amp; Summarize</span></div><i/><div><b>3</b><span>Store in Repository</span></div></div>
        </div>

        <div className="content-layout">
          <section className="thread-panel">
            <h2>{tab === "emails" ? <Mail size={21}/> : <Users size={21}/>} {tab === "emails" ? `Email Threads (${filteredEmails.length})` : `Meeting Transcripts (${filteredMeetings.length})`}</h2>
            <div className="thread-list">
              {tab === "emails" ? filteredEmails.map(item => <button type="button" key={item.id} onClick={() => {setEmailId(item.id);}} className={`thread-card ${emailId === item.id ? "chosen" : ""}`}>
                <Mail size={20}/><span className="thread-info"><strong>{item.subject}</strong><small>{item.date} &nbsp;•&nbsp; From: {item.sender}</small></span><em>{item.status}</em>
              </button>) : filteredMeetings.map(item => <button type="button" key={item.id} onClick={() => setMeetingId(item.id)} className={`thread-card ${meetingId === item.id ? "chosen" : ""}`}>
                <Users size={20}/><span className="thread-info"><strong>{item.title}</strong><small>{item.date} &nbsp;•&nbsp; {item.participants}</small></span><em>Reviewed</em>
              </button>)}
              {((tab === "emails" && filteredEmails.length === 0) || (tab === "meetings" && filteredMeetings.length === 0)) && <p className="empty-state">No matching records found.</p>}
            </div>
          </section>

          <section className="detail-panel">
            {tab === "emails" ? <>
              <div className="detail-heading"><Mail size={24}/><h2>{email.subject}</h2><span className="resolved"><Check size={14}/> Resolved</span></div>
              <div className="email-timeline">{email.messages.map((m, i) => <article className="timeline-entry" key={`${email.id}-${i}`}><i className={`dot dot-${i}`}/><div className="message-card"><b className="message-avatar">{m.initial}</b><div className="message-content"><div className="message-top"><strong>{m.sender}</strong><time>{m.date}</time></div><small>To: {m.recipient}</small><p>{m.body}</p></div></div></article>)}</div>
            </> : <>
              <div className="detail-heading"><Users size={24}/><h2>{meeting.title}</h2><span className="resolved"><Check size={14}/> Reviewed</span></div>
              <div className="meeting-detail">
                <div className="meeting-meta"><div><small>MEETING DATE</small><strong>{meeting.date}</strong></div><div><small>PARTICIPANTS</small><strong>{meeting.participants}</strong></div></div>
                <h3>Meeting Transcript</h3>
                {meeting.transcript.map((line, i) => <div className="transcript-line" key={i}><b>{String(i + 1).padStart(2, "0")}</b><p>{line}</p></div>)}
              </div>
            </>}
            <footer className="detail-footer">
              {isStored && <span className="stored-note"><Check size={15}/> Report stored in this session</span>}
              <button type="button" className={`store-button ${isStored ? "stored" : ""}`} onClick={storeReport}><Database size={20}/>{isStored ? "Report Stored" : "Store Report in Repository"}{isStored ? <Check size={19}/> : <ArrowRight size={20}/>}</button>
            </footer>
          </section>
        </div>
        <p className="demo-note">Demonstration content only. Replace sample communications with approved engineering records before production use.</p>
      </section>
    </main>
  </div>;
}
