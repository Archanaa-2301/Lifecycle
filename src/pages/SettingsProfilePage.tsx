import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { ArrowLeft, User, Lock, Sliders, RotateCcw, Check, Shield } from 'lucide-react';

interface SettingsProfilePageProps {
  onNavigate: (page: PageId) => void;
  onResetData: () => void;
}

export const SettingsProfilePage: React.FC<SettingsProfilePageProps> = ({
  onNavigate,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    onResetData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Account &amp; System Configuration · Screen 20
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Settings / User Profile
          </h1>
        </div>

        <button
          onClick={() => onNavigate(4)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* User Card */}
        <div className="flex items-center gap-5 border-b border-teal-900/40 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#050e17] rounded-[14px] flex items-center justify-center font-bold text-xl text-cyan-300 font-mono">
              AR
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Alex Ramesh / Archanaa</h2>
            <div className="text-xs text-teal-400 font-medium">Design Engineer · Chassis Systems</div>
            <div className="text-xs text-slate-400 mt-1">archanaa8642@gmail.com · Ford Powertrain</div>
          </div>
        </div>

        {/* Tab Options */}
        <div className="flex items-center gap-2 border-b border-teal-900/40 pb-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-[#040e17]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'password'
                ? 'bg-cyan-500 text-[#040e17]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-cyan-500 text-[#040e17]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            UI Preferences
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Alex Ramesh / Archanaa"
                className="w-full bg-[#050e17] border border-teal-900 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Assigned Department</label>
              <input
                type="text"
                defaultValue="Chassis &amp; Suspension Teardown Core"
                className="w-full bg-[#050e17] border border-teal-900 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Engineering Security Clearance</label>
              <input
                type="text"
                disabled
                defaultValue="Level 4 - OEM Global Program Access"
                className="w-full bg-[#040a10] border border-teal-950 rounded-xl px-3.5 py-2 text-cyan-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Default Vehicle Program</label>
              <input
                type="text"
                defaultValue="Ford Endeavour (2022) / Ford Titanium 2026"
                className="w-full bg-[#050e17] border border-teal-900 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
          </div>
        )}

        {/* Reset Demo Data Action */}
        <div className="pt-4 border-t border-teal-900/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">Reset Demo Data</div>
            <div className="text-[11px] text-slate-400">Restore factory sample telemetry and teardown records</div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 text-xs font-bold text-rose-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetDone ? 'Demo Data Restored!' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
