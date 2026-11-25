import React, { useState } from 'react';
import { TeardownPart, HistoryEntry } from '../../types/teardown';
import { Clock, Plus, User, ShieldCheck } from 'lucide-react';

interface HistoryTabProps {
  part: TeardownPart;
  onAddHistory: (entry: HistoryEntry) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ part, onAddHistory }) => {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const entry: HistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      author: part.engineer || 'ARCHANAA',
      action: newNote.trim(),
    };

    onAddHistory(entry);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            Component Audit Trail &amp; Revision Changelog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable audit logging for teardown physical disassembly, CMM inspections, and pricing revisions.
          </p>
        </div>
      </div>

      {/* Log Form */}
      <form onSubmit={handleAddNote} className="bg-[#081521]/90 border border-teal-900/60 rounded-2xl p-4 flex gap-3">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Append engineering teardown observation or revision note..."
          className="flex-1 bg-[#050e17] border border-teal-800/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer"
        >
          Add Log
        </button>
      </form>

      {/* Timeline entries */}
      <div className="space-y-3">
        {part.history.length === 0 ? (
          <div className="p-8 text-center bg-[#07131e]/50 border border-teal-900/40 rounded-2xl">
            <p className="text-xs text-slate-400">No revision events recorded yet.</p>
          </div>
        ) : (
          part.history.map((hist) => (
            <div
              key={hist.id}
              className="p-4 rounded-xl bg-[#081521]/80 border border-teal-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#050e17] border border-teal-950 text-cyan-400 shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white leading-relaxed">{hist.action}</div>
                  <div className="text-[11px] text-teal-400 flex items-center gap-1.5 mt-1 font-mono">
                    <User className="w-3 h-3" />
                    <span>Logged by: {hist.author}</span>
                  </div>
                </div>
              </div>

              <div className="font-mono text-[11px] text-slate-400 sm:text-right shrink-0">
                {hist.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
