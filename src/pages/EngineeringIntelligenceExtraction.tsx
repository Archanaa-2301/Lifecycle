import React, { useEffect, useMemo, useState } from "react";
import { createPDFBase64, readRepositoryPDFs, syncRepositoryPDFs, writeRepositoryPDF, type RepositoryName } from "../utils/repositoryStore";
import { ArrowLeft, BrainCircuit, Mail, Users, ArrowRight, Database, Check, ChevronRight, Search, FileText, CalendarDays, UserRound, Save, FileCheck2, Download } from "lucide-react";

type Message = { sender: string; recipient: string; date: string; initial: string; body: string };
type Email = { id: number; subject: string; sender: string; date: string; status: string; messages: Message[]; category: Repository; impact: string; rootCause: string; correctiveAction: string; outcome: string };
type Meeting = { id: number; title: string; date: string; participants: string; transcript: { time: string; speaker: string; text: string }[]; decisions: string[]; actions: string[]; category: Repository };
type Repository = RepositoryName;
type StoredReport = { id: string; title: string; sourceType: "Email" | "Meeting"; component: string; repository: Repository; savedAt: string; report: string; sourceDate: string };

const repositories: Repository[] = ["Know-How", "Project Management", "Change Management", "Warranty / Field Return / Failure"];

// Demonstration records. Replace these examples with approved company communications before production use.
const emails: Email[] = [
  { id: 1, subject: "RB – Compression Set Issue", sender: "Kumar R. (LTTS)", date: "14 Oct 2026", status: "Resolved", category: "Warranty / Field Return / Failure", impact: "Compression set measured at approximately 18%, above the stated acceptance limit of 15%, with a potential effect on long-term energy absorption.", rootCause: "The investigation identified inadequate material drying before moulding as the probable cause.", correctiveAction: "Introduce controlled material drying at 100 °C for 4 hours and update the process document. Repeat the compression-set test on the corrected batch.", outcome: "Retest result was 12%, within the stated ≤15% limit. The thread records the issue as resolved.", messages: [
    { sender: "Kumar R. (LTTS)", recipient: "Suspension Engineering Team", date: "14 Oct 2026 · 10:24 AM", initial: "K", body: "The latest Rebound Bumper Batch B is showing a compression set of approximately 18% against the specification limit of ≤15%. This may affect long-term energy absorption and durability. Please investigate the root cause, check the moulding process and recommend containment and corrective action. Please confirm whether the remaining batch should be held pending review." },
    { sender: "Meera S. (Tenneco)", recipient: "Kumar R. (LTTS)", date: "15 Oct 2026 · 02:17 PM", initial: "M", body: "We reviewed the material certificate, incoming inspection and moulding history. The available evidence points to inadequate material drying before moulding. Please trial controlled drying at 100 °C for 4 hours, record the actual drying cycle and mould the validation samples. Update the process document if the trial confirms the improvement." },
    { sender: "Kumar R. (LTTS)", recipient: "Meera S. (Tenneco)", date: "16 Oct 2026 · 11:03 AM", initial: "K", body: "The controlled-drying trial and repeat test are complete. The measured compression set is now 12%, within the ≤15% limit. The process record has been updated for the trial. The affected batch can be dispositioned after the normal quality approval. From the engineering side, the reported issue is resolved." }
  ]},
  { id: 2, subject: "RB – Material Hardness Clarification", sender: "Meera S. (Tenneco)", date: "10 Oct 2026", status: "Resolved", category: "Know-How", impact: "Variation in measured hardness created uncertainty about material conformity and sample-to-sample consistency.", rootCause: "The supplier material certificate was reviewed; the variation was attributed to an incorrect test conditioning period rather than a confirmed material-grade change.", correctiveAction: "Align the inspection procedure with the required conditioning period and repeat hardness measurements on conditioned samples.", outcome: "Follow-up readings were reported within the illustrative acceptance range and the discussion was closed.", messages: [
    { sender: "Meera S. (Tenneco)", recipient: "Suspension Engineering Team", date: "10 Oct 2026 · 09:30 AM", initial: "M", body: "The latest Rebound Bumper samples show variation in hardness readings. Before accepting the batch, please verify the specified material grade, review the supplier certificate and confirm the hardness test method and conditioning period used by the inspection team." },
    { sender: "Kumar R. (LTTS)", recipient: "Meera S. (Tenneco)", date: "10 Oct 2026 · 02:15 PM", initial: "K", body: "The supplier material certificate matches the reviewed material requirement. During the test-method review, we found that the samples were not conditioned for the required duration before measurement. We will update the inspection procedure and repeat the readings after correct conditioning." },
    { sender: "Meera S. (Tenneco)", recipient: "Kumar R. (LTTS)", date: "11 Oct 2026 · 10:00 AM", initial: "M", body: "The updated samples and repeat readings have been reviewed. The readings are within the illustrative acceptance range when the agreed conditioning procedure is followed. Please retain the revised inspection instruction with the component quality records. Closing this clarification." }
  ]},
  { id: 3, subject: "RB – NVH Concern at Low Temperature", sender: "Arun P. (LTTS)", date: "06 Oct 2026", status: "Resolved", category: "Change Management", impact: "A noise concern was reported during suspension rebound operation in low-temperature conditions.", rootCause: "The discussion focused on low-temperature material response and the bumper-to-contact-interface interaction; the sample thread does not establish a quantified root cause.", correctiveAction: "Review the interface configuration and evaluate the revised configuration under the relevant low-temperature condition.", outcome: "The revised interface configuration passed the illustrative follow-up evaluation and the reported concern was closed.", messages: [
    { sender: "Arun P. (LTTS)", recipient: "Suspension Engineering Team", date: "06 Oct 2026 · 11:15 AM", initial: "A", body: "A noise concern has been reported during suspension rebound operation at low ambient temperature. The concern appears during the rebound event. Please review the bumper response, contact interface and available test observations before proposing a design or material change." },
    { sender: "Meera S. (Tenneco)", recipient: "Arun P. (LTTS)", date: "07 Oct 2026 · 03:20 PM", initial: "M", body: "The team is reviewing low-temperature material behaviour and the contact interface. Please compare the current and proposed interface configurations and document the conditions under which the noise is reproducible. Avoid closing the issue until the revised configuration is evaluated." },
    { sender: "Arun P. (LTTS)", recipient: "Meera S. (Tenneco)", date: "08 Oct 2026 · 04:10 PM", initial: "A", body: "The revised interface configuration completed the follow-up evaluation under the reviewed low-temperature condition. The reported noise concern was not observed in the illustrative retest. The evaluation result has been shared with the team and the concern is marked closed." }
  ]},
  { id: 4, subject: "RB – Dimensional Deviation (Batch B)", sender: "Suresh V.", date: "02 Oct 2026", status: "Resolved", category: "Project Management", impact: "Incoming inspection identified a dimensional deviation in the latest Rebound Bumper Batch B.", rootCause: "The inspection method and mould setup were reviewed. The sample thread does not provide a confirmed numerical root-cause analysis.", correctiveAction: "Adjust the mould setup and repeat inspection using the reviewed measurement method. Review disposition of the affected batch through quality approval.", outcome: "Adjusted samples passed repeat inspection and the issue was recorded as closed.", messages: [
    { sender: "Suresh V.", recipient: "Kumar R. (LTTS)", date: "02 Oct 2026 · 10:00 AM", initial: "S", body: "Incoming inspection identified a dimensional deviation in the latest Rebound Bumper Batch B. The measured feature is outside the drawing tolerance on the inspected samples. Please review the affected dimension, confirm the measurement method and advise whether the batch should remain on hold." },
    { sender: "Kumar R. (LTTS)", recipient: "Suresh V.", date: "03 Oct 2026 · 01:30 PM", initial: "K", body: "We reviewed the inspection method and mould setup information. Please verify the measurement fixture and apply the proposed mould adjustment. Submit repeat measurements from the adjusted samples along with the inspection evidence before requesting batch disposition." },
    { sender: "Suresh V.", recipient: "Kumar R. (LTTS)", date: "04 Oct 2026 · 03:45 PM", initial: "S", body: "The mould adjustment is complete and the adjusted samples passed repeat inspection using the reviewed method. The updated inspection results have been shared for quality review. The dimensional concern is recorded as closed, subject to the normal batch approval process." }
  ]}
];

const meetings: Meeting[] = [
  { id: 1, title: "Rebound Bumper Design Review", date: "12 Oct 2026 · 10:00–10:45 AM", participants: "Kumar R., Meera S., Arun P., Suresh V.", category: "Know-How", transcript: [
    { time: "10:02 AM", speaker: "Kumar R.", text: "The review started with the latest Rebound Bumper compression-set observations. The team noted that the reported Batch B value was approximately 18%, compared with the stated acceptance limit of 15%." },
    { time: "10:09 AM", speaker: "Meera S.", text: "The material certificate and process history were reviewed. The discussion focused on whether material storage, pre-mould drying or moulding conditions could explain the observed variation." },
    { time: "10:18 AM", speaker: "Suresh V.", text: "The available process record did not clearly demonstrate that the required drying cycle had been completed for the affected batch. The team requested a controlled trial with the drying cycle recorded." },
    { time: "10:27 AM", speaker: "Arun P.", text: "Validation requested repeat compression-set testing on samples produced using the controlled process. The test result should be compared against the same acceptance criterion and the evidence attached to the batch record." },
    { time: "10:39 AM", speaker: "Kumar R.", text: "The team agreed to trial material drying at 100 °C for 4 hours, update the process documentation if successful and review the retest before batch disposition." }
  ], decisions: ["Run a controlled material-drying trial at 100 °C for 4 hours.", "Repeat compression-set testing and compare with the ≤15% acceptance limit.", "Update the process record after the trial is reviewed."], actions: ["Suresh V.: record the drying cycle and provide trial samples.", "Validation: complete repeat compression-set testing and share results.", "Design: review the evidence and update the process documentation."] },
  { id: 2, title: "Rebound Bumper Validation & Closure Meeting", date: "16 Oct 2026 · 02:00–02:40 PM", participants: "Kumar R., Meera S., Suresh V., Arun P.", category: "Project Management", transcript: [
    { time: "02:01 PM", speaker: "Arun P.", text: "The meeting reviewed the samples produced after the controlled material-drying trial. The team confirmed that the repeat compression-set result shared for review was 12%." },
    { time: "02:08 PM", speaker: "Meera S.", text: "The reported 12% result is within the stated ≤15% acceptance limit. The team reviewed the test conditions and requested that the result remain traceable to the sample and process record." },
    { time: "02:17 PM", speaker: "Suresh V.", text: "Suresh V. confirmed that the trial process record and sample identification were available for review. Batch disposition will continue through the normal quality approval process." },
    { time: "02:26 PM", speaker: "Kumar R.", text: "The engineering action is to retain the updated drying instruction and the validation evidence with the Rebound Bumper records. Any production process change must follow the applicable approval workflow." },
    { time: "02:35 PM", speaker: "Kumar R.", text: "The team agreed that the engineering concern can be marked resolved based on the reviewed trial result. The meeting closed with the documentation and quality-approval actions assigned." }
  ], decisions: ["The reviewed 12% compression-set result meets the stated ≤15% limit.", "The engineering concern is marked resolved based on the trial evidence.", "Batch disposition remains subject to normal quality approval."], actions: ["Validation: archive the test result with sample identification.", "Engineering: retain the updated drying instruction in the component records.", "Suresh V.: complete the normal batch disposition approval."] },
  { id: 3, title: "Rebound Bumper NVH Design Change Review", date: "08 Oct 2026 · 11:00–11:40 AM", participants: "Arun P., Meera S., Kumar R.", category: "Change Management", transcript: [
    { time: "11:03 AM", speaker: "Arun P.", text: "The team reviewed the low-temperature noise concern reported during suspension rebound. The concern was observed around the bumper contact event and requires a controlled comparison before any design change is released." },
    { time: "11:12 AM", speaker: "Meera S.", text: "The current and proposed contact-interface configurations were compared. The team requested that the change record identify the affected interface dimensions, material assumptions and validation conditions." },
    { time: "11:24 AM", speaker: "Kumar R.", text: "Design will prepare a controlled revision of the interface drawing and attach the engineering rationale. The existing released configuration must remain traceable until the revised design completes validation and approval." },
    { time: "11:34 AM", speaker: "Kumar R.", text: "The proposed interface revision will proceed through the formal engineering change workflow. Validation evidence and cross-functional approval are required before implementation." }
  ], decisions: ["Evaluate the revised bumper contact-interface configuration under low-temperature conditions.", "Track the drawing revision through formal change control.", "Do not implement the revision before validation and approval."], actions: ["Design: prepare the revised interface drawing and change rationale.", "Validation: define and execute the low-temperature comparison test.", "Engineering: attach evidence and approvals to the change record."] },
  { id: 4, title: "Rebound Bumper Field Return Failure Review", date: "05 Oct 2026 · 03:00–03:45 PM", participants: "Suresh V., Kumar R., Meera S., Divya K.", category: "Warranty / Field Return / Failure", transcript: [
    { time: "03:02 PM", speaker: "Divya K.", text: "The meeting reviewed a returned Rebound Bumper associated with a reported dimensional concern. The team agreed to preserve the returned part, inspection photographs and vehicle or batch traceability before destructive examination." },
    { time: "03:13 PM", speaker: "Suresh V.", text: "Initial dimensional checks indicate a deviation on the inspected feature. The measurement method and fixture condition must be verified before concluding whether the part is nonconforming." },
    { time: "03:25 PM", speaker: "Meera S.", text: "The investigation will compare the returned part with retained production samples and the released drawing. Any confirmed failure mode should be linked to the batch and manufacturing records." },
    { time: "03:37 PM", speaker: "Kumar R.", text: "The team agreed to keep the case open until the measurement method is confirmed and the returned-part investigation is documented. Containment and batch disposition will follow the quality process." }
  ], decisions: ["Preserve the returned part and supporting traceability evidence.", "Verify the measurement method before confirming nonconformance.", "Keep the field-return case open until investigation evidence is reviewed."], actions: ["Divya K.: provide return details, photographs and batch traceability.", "Suresh V.: verify the measurement fixture and repeat dimensional checks.", "Engineering: document the failure analysis and recommend containment."] }
];

type ExtractionProps = { initialTab?: "emails" | "meetings"; onBack?: () => void; componentName?: string };

function readReports(): StoredReport[] {
  return readRepositoryPDFs().map(item => ({ id: item.id, title: item.title, sourceType: item.sourceType === "Manual Entry" ? "Email" : item.sourceType, component: item.component, repository: item.repository, savedAt: item.savedAt, report: "", sourceDate: item.sourceDate }));
}

export default function EngineeringIntelligenceExtraction({ initialTab = "emails", onBack, componentName = "Rebound Bumper" }: ExtractionProps) {
  const [tab, setTab] = useState<"emails" | "meetings">(initialTab);
  const [emailId, setEmailId] = useState(1);
  const [meetingId, setMeetingId] = useState(1);
  const [search, setSearch] = useState("");
  const [repository, setRepository] = useState<Repository>("Know-How");
  const [reports, setReports] = useState<StoredReport[]>(readReports);
  const [reportPage, setReportPage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  useEffect(() => { void syncRepositoryPDFs().then(items => setReports(items.map(item => ({ id: item.id, title: item.title, sourceType: item.sourceType === "Manual Entry" ? "Email" : item.sourceType, component: item.component, repository: item.repository, savedAt: item.savedAt, report: "", sourceDate: item.sourceDate })))); }, []);
  const email = emails.find(x => x.id === emailId) ?? emails[0];
  const meeting = meetings.find(x => x.id === meetingId) ?? meetings[0];
  const filteredEmails = useMemo(() => emails.filter(x => `${x.subject} ${x.sender}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const filteredMeetings = useMemo(() => meetings.filter(x => `${x.title} ${x.participants}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const sourceId = `${tab}-${tab === "emails" ? email.id : meeting.id}`;
  const existing = reports.find(x => x.id === sourceId);
  const reportTitle = tab === "emails" ? email.subject : meeting.title;
  const reportText = tab === "emails"
    ? `ENGINEERING COMMUNICATION REPORT\nComponent: ${componentName} (RB-001)\nSource: Email thread\nSubject: ${email.subject}\nSource date: ${email.date}\n\nPROBLEM / OBSERVATION\n${email.impact}\n\nINVESTIGATION / ROOT CAUSE\n${email.rootCause}\n\nCORRECTIVE / PREVENTIVE ACTION\n${email.correctiveAction}\n\nOUTCOME / CLOSURE\n${email.outcome}\n\nCOMMUNICATION HISTORY\n${email.messages.map(m => `${m.date} | ${m.sender} → ${m.recipient}\n${m.body}`).join("\n\n")}`
    : `ENGINEERING MEETING REPORT\nComponent: ${componentName} (RB-001)\nSource: Meeting transcript\nMeeting: ${meeting.title}\nDate: ${meeting.date}\nParticipants: ${meeting.participants}\n\nDISCUSSION TRANSCRIPT\n${meeting.transcript.map(t => `${t.time} | ${t.speaker}\n${t.text}`).join("\n\n")}\n\nDECISIONS\n${meeting.decisions.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nACTION ITEMS\n${meeting.actions.map((x, i) => `${i + 1}. ${x}`).join("\n")}`;

  async function saveReport() {
    const sourceDate = tab === "emails" ? email.date : meeting.date;
    try {
      const pdfBase64 = createPDFBase64(`${reportTitle} - Engineering Report`, reportText.split("\n"));
      const saved = await writeRepositoryPDF({ id: sourceId, title: reportTitle, sourceType: tab === "emails" ? "Email" : "Meeting", component: `${componentName} (RB-001)`, repository, savedAt: new Date().toLocaleString(), sourceDate, pdfBase64 });
      setReports(saved.map(item => ({ id: item.id, title: item.title, sourceType: item.sourceType === "Manual Entry" ? "Email" : item.sourceType, component: item.component, repository: item.repository, savedAt: item.savedAt, report: "", sourceDate: item.sourceDate })));
      setSavedMessage(`PDF saved to ${repository} repository`);
    } catch {
      setSavedMessage("Could not save the PDF to the repository server. Check that LIFEX is running with npm run dev.");
    }
  }

  return <main className="lifex-extraction-page">
    {!reportPage ? <>
      <div className="lifex-extraction-breadcrumb">
        {onBack && <button type="button" className="lifex-back-link" onClick={onBack}><ArrowLeft size={16}/> Back to Component Workspace</button>}
        <span>Component Workspace</span><ChevronRight size={14}/><span>Rebound Bumper</span><ChevronRight size={14}/><strong>Engineering Intelligence Extraction</strong>
      </div>
      <header className="lifex-extraction-heading">
        <div className="lifex-extraction-heading-icon"><BrainCircuit size={32}/></div>
        <div><h1>Engineering Intelligence Extraction</h1><p>Open an email or meeting to read the complete source first. Generate its report only after reviewing the discussion.</p></div>
        <div className="lifex-extraction-component"><strong>{componentName}</strong><small>RB-001 · Suspension System</small><span>CORE COMPONENT</span></div>
      </header>
      <div className="lifex-extraction-toolbar">
        <div className="lifex-source-tabs">
          <button type="button" className={tab === "emails" ? "active" : ""} onClick={() => {setTab("emails");setReportPage(false);setSavedMessage("");}}><Mail size={21}/> Emails (4)</button>
          <button type="button" className={tab === "meetings" ? "active" : ""} onClick={() => {setTab("meetings");setReportPage(false);setSavedMessage("");}}><Users size={21}/> Meetings (4)</button>
        </div>
        <div className="lifex-extraction-steps"><span className="active"><b>1</b>Select source</span><i/><span><b>2</b>Review discussion</span><i/><span><b>3</b>Generate report</span></div>
      </div>
      <div className="lifex-extraction-grid">
        <aside className="lifex-source-list">
          <div className="lifex-panel-heading"><strong>{tab === "emails" ? "Email Threads" : "Meeting Records"}</strong><span>{tab === "emails" ? filteredEmails.length : filteredMeetings.length}</span></div>
          <label className="lifex-source-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sources..."/></label>
          <div className="lifex-source-items">
            {tab === "emails" ? filteredEmails.map(item => <button type="button" key={item.id} onClick={() => {setEmailId(item.id);setRepository(item.category);setSavedMessage("");setReportPage(false);}} className={`lifex-source-item ${emailId === item.id ? "selected" : ""}`}><Mail size={19}/><span><strong>{item.subject}</strong><small>{item.date} · {item.sender}</small></span><em>{item.status}</em><ChevronRight size={16}/></button>) : filteredMeetings.map(item => <button type="button" key={item.id} onClick={() => {setMeetingId(item.id);setRepository(item.category);setSavedMessage("");setReportPage(false);}} className={`lifex-source-item ${meetingId === item.id ? "selected" : ""}`}><CalendarDays size={19}/><span><strong>{item.title}</strong><small>{item.date}</small><small>{item.participants}</small></span><ChevronRight size={16}/></button>)}
            {((tab === "emails" && filteredEmails.length === 0) || (tab === "meetings" && filteredMeetings.length === 0)) && <p className="lifex-empty">No matching records found.</p>}
          </div>
        </aside>
        <section className="lifex-discussion-panel">
          {tab === "emails" ? <>
            <div className="lifex-discussion-title"><div><Mail size={22}/><h2>{email.subject}</h2></div><span className="lifex-status"><Check size={14}/>{email.status}</span></div>
            <div className="lifex-source-intro"><strong>What this thread is about</strong><p>{email.impact}</p><div><span><UserRound size={14}/> {email.sender}</span><span><CalendarDays size={14}/> {email.date}</span><span>{email.messages.length} messages</span></div></div>
            <div className="lifex-message-timeline">{email.messages.map((m, i) => <article className="lifex-message" key={`${email.id}-${i}`}><b className="lifex-avatar">{m.initial}</b><div><div className="lifex-message-meta"><strong>{m.sender}</strong><time>{m.date}</time></div><small>To: {m.recipient}</small><p>{m.body}</p></div></article>)}</div>
          </> : <>
            <div className="lifex-discussion-title"><div><Users size={22}/><h2>{meeting.title}</h2></div><span className="lifex-status">Meeting minutes</span></div>
            <div className="lifex-meeting-meta"><div><small>MEETING DATE</small><strong>{meeting.date}</strong></div><div><small>PARTICIPANTS</small><strong>{meeting.participants}</strong></div></div>
            <h3 className="lifex-section-heading">Discussion transcript</h3>
            <div className="lifex-transcript">{meeting.transcript.map((line, i) => <article key={i}><time>{line.time}</time><div><strong>{line.speaker}</strong><p>{line.text}</p></div></article>)}</div>
            <div className="lifex-decision-grid"><section><h3>Decisions</h3><ul>{meeting.decisions.map((x, i) => <li key={i}>{x}</li>)}</ul></section><section><h3>Action items</h3><ul>{meeting.actions.map((x, i) => <li key={i}>{x}</li>)}</ul></section></div>
          </>}

        </section>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-800/70 bg-[#061b27] p-4">
        <div><strong className="text-sm text-white">Source review complete?</strong><p className="mt-1 text-xs text-slate-400">Generate a separate engineering report from this complete email thread or meeting transcript.</p></div>
        <button type="button" onClick={() => { setRepository(tab === "emails" ? email.category : meeting.category); setSavedMessage(""); setReportPage(true); }} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-xs font-bold text-[#03111a] shadow-[0_0_22px_rgba(34,211,238,.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 active:translate-y-0 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-cyan-200"><FileCheck2 size={17}/> Generate Engineering Report <ArrowRight size={16}/></button>
      </div>
      <div className="lifex-repository-counts"><strong><Database size={17}/> Saved report counts</strong>{repositories.map(r => <span key={r}>{r}: <b>{reports.filter(x => x.repository === r).length}</b></span>)}</div>
    </> : <section className="lifex-report-page">
      <div className="lifex-report-topline"><button type="button" className="lifex-back-link" onClick={() => setReportPage(false)}><ArrowLeft size={16}/> Back to discussion</button><span>ENGINEERING KNOWLEDGE · REPORT</span></div>
      <header className="lifex-report-header"><div className="lifex-report-mark"><FileCheck2 size={28}/></div><div><p>{componentName.toUpperCase()} · RB-001</p><h1>{reportTitle}</h1><span>{tab === "emails" ? "Email communication report" : "Meeting minutes report"} · {tab === "emails" ? email.date : meeting.date}</span></div><span className="lifex-report-status"><Check size={14}/> Generated · {existing?.repository === repository ? "Saved" : "Not saved"}</span></header>
      <div className="lifex-report-meta-grid"><div><small>SOURCE TYPE</small><strong>{tab === "emails" ? "Email thread" : "Meeting transcript"}</strong></div><div><small>SOURCE RECORD</small><strong>{reportTitle}</strong></div><div><small>SUGGESTED REPOSITORY</small><strong>{repository}</strong></div><div><small>COMPONENT</small><strong>{componentName} (RB-001)</strong></div></div>
      {tab === "emails" ? <div className="lifex-report-sections"><section><small>01 · PROBLEM / OBSERVATION</small><p>{email.impact}</p></section><section><small>02 · INVESTIGATION / ROOT CAUSE</small><p>{email.rootCause}</p></section><section><small>03 · CORRECTIVE / PREVENTIVE ACTION</small><p>{email.correctiveAction}</p></section><section><small>04 · OUTCOME / CLOSURE</small><p>{email.outcome}</p></section><section className="lifex-report-history"><small>05 · COMMUNICATION HISTORY</small>{email.messages.map((m, i) => <article key={i}><div><strong>{m.sender}</strong><time>{m.date}</time></div><p>{m.body}</p></article>)}</section></div> : <div className="lifex-report-sections"><section className="lifex-report-history"><small>01 · MEETING DISCUSSION</small>{meeting.transcript.map((line, i) => <article key={i}><div><strong>{line.speaker}</strong><time>{line.time}</time></div><p>{line.text}</p></article>)}</section><section><small>02 · DECISIONS</small><ul>{meeting.decisions.map((x, i) => <li key={i}>{x}</li>)}</ul></section><section><small>03 · ACTION ITEMS</small><ul>{meeting.actions.map((x, i) => <li key={i}>{x}</li>)}</ul></section></div>}
      <div className="lifex-report-savebar"><label>Choose repository (optional save)<select value={repository} onChange={e => setRepository(e.target.value as Repository)}>{repositories.map(r => <option key={r} value={r}>{r}</option>)}</select></label><button type="button" className="lifex-save-action" disabled={isSaving} onClick={async () => {setIsSaving(true); await saveReport(); setIsSaving(false);}}>{isSaving ? "Saving..." : existing?.repository === repository ? "Update saved report" : "Save report to repository"}<Save size={18}/></button></div>
      {savedMessage && <div className="lifex-save-success"><Check size={18}/><span><strong>{savedMessage}</strong><small>PDF is stored in the {repository} repository on the LIFEX server.</small></span></div>}
      <p className="lifex-report-disclaimer">Demonstration report generated from the sample source record. Verify technical details against approved engineering records before production use.</p>
    </section>}
  </main>;
}
