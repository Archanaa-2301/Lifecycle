import React from 'react';
import { PageId } from '../types/lifex';
import { Home, Car, AlertTriangle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: PageId) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-6">
        <div className="text-8xl sm:text-9xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-teal-400 to-blue-600 tracking-tight drop-shadow-[0_15px_30px_rgba(6,182,212,0.4)]">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            The requested engineering CAD subsystem view or lifecycle dossier does not exist in this database branch.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate(4)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate(5)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#081724] hover:bg-[#0c2234] border border-teal-700/60 text-cyan-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Car className="w-4 h-4" />
            <span>Go to Vehicles</span>
          </button>
        </div>
      </div>
    </div>
  );
};
