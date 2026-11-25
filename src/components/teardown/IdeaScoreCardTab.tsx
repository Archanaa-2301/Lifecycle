import React, { useState } from 'react';
import { TeardownPart, TeardownIdea } from '../../types/teardown';
import { Plus, TrendingDown, Weight, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface IdeaScoreCardTabProps {
  part: TeardownPart;
  onAddIdea: (newIdea: TeardownIdea) => void;
}

export const IdeaScoreCardTab: React.FC<IdeaScoreCardTabProps> = ({ part, onAddIdea }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCostPct, setNewCostPct] = useState(10);
  const [newWeightPct, setNewWeightPct] = useState(5);
  const [newFeasibility, setNewFeasibility] = useState(8.5);
  const [newCategory, setNewCategory] = useState<TeardownIdea['category']>('Material Substitution');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const idea: TeardownIdea = {
      id: `idea-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      potentialCostReductionPercent: newCostPct,
      potentialWeightReductionPercent: newWeightPct,
      feasibilityScore: newFeasibility,
      riskLevel: newCostPct > 20 ? 'High' : newCostPct > 10 ? 'Medium' : 'Low',
      category: newCategory,
      status: 'Proposed',
      author: part.engineer || 'ARCHANAA',
      date: new Date().toISOString().split('T')[0],
    };

    onAddIdea(idea);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top VAVE Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            VAVE Ideation &amp; Feasibility Scorecard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Value Analysis &amp; Value Engineering cost reduction proposals for {part.name}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-[#041019] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Propose VAVE Idea</span>
        </button>
      </div>

      {/* Ideas List */}
      {part.ideas.length === 0 ? (
        <div className="p-8 text-center bg-[#07131e]/50 border border-teal-900/40 rounded-2xl">
          <p className="text-xs text-slate-400">No VAVE optimization proposals registered for this component yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {part.ideas.map((idea) => {
            const costSavingsPerUnit = (part.probableCostINR * (idea.potentialCostReductionPercent / 100)).toFixed(0);
            return (
              <div
                key={idea.id}
                className="p-5 rounded-2xl bg-[#081521]/90 border border-teal-900/70 hover:border-cyan-500/60 transition-all shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-teal-800/40">
                      {idea.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/50">
                      {idea.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#050e17] p-3 rounded-xl border border-teal-950">
                    {idea.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-teal-950 text-center font-mono">
                  <div className="p-2 bg-[#050e17] rounded-lg border border-teal-950">
                    <div className="text-[10px] text-teal-400 uppercase">Cost Delta</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      -{idea.potentialCostReductionPercent}% (₹{costSavingsPerUnit})
                    </div>
                  </div>

                  <div className="p-2 bg-[#050e17] rounded-lg border border-teal-950">
                    <div className="text-[10px] text-teal-400 uppercase">Mass Delta</div>
                    <div className="text-xs font-bold text-cyan-300 mt-0.5">
                      -{idea.potentialWeightReductionPercent}%
                    </div>
                  </div>

                  <div className="p-2 bg-[#050e17] rounded-lg border border-teal-950">
                    <div className="text-[10px] text-teal-400 uppercase">Feasibility</div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5">
                      {idea.feasibilityScore}/10
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Idea Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-[#081521] border border-teal-700/80 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">Log New VAVE Idea</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hollow stepped pin geometry..."
                  className="w-full bg-[#050e17] border border-teal-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Engineering Description &amp; Trade-offs</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details of material or manufacturing process substitution..."
                  className="w-full bg-[#050e17] border border-teal-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cost Red. (%)</label>
                  <input
                    type="number"
                    value={newCostPct}
                    onChange={(e) => setNewCostPct(Number(e.target.value))}
                    className="w-full bg-[#050e17] border border-teal-800 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mass Red. (%)</label>
                  <input
                    type="number"
                    value={newWeightPct}
                    onChange={(e) => setNewWeightPct(Number(e.target.value))}
                    className="w-full bg-[#050e17] border border-teal-800 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Score (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFeasibility}
                    onChange={(e) => setNewFeasibility(Number(e.target.value))}
                    className="w-full bg-[#050e17] border border-teal-800 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-teal-900/60">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md"
              >
                Submit Proposal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
