import React from 'react';
import { ArrowLeft, Save, Sun, Moon, Car, Check } from 'lucide-react';
import { TeardownPart } from '../types/teardown';

interface HeaderProps {
  part: TeardownPart;
  onSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onPrev: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  part,
  onSave,
  isSaving,
  saveSuccess,
  theme,
  onToggleTheme,
  onPrev,
}) => {
  return (
    <header className="px-4 sm:px-8 pt-6 pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Back Button + Breadcrumbs + Title */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Back button */}
          <button
            onClick={onPrev}
            title="Navigate Back / Previous"
            className="w-10 h-10 rounded-xl bg-[#0d1c26]/90 hover:bg-[#122836] border border-teal-800/40 text-teal-300 hover:text-cyan-200 flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer mt-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            {/* Breadcrumb kicker with car icon */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-1">
              <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{part.vehicle}</span>
              <span className="text-teal-600 font-normal">|</span>
              <span className="text-cyan-300/80">{part.assembly}</span>
            </div>

            {/* Title + TEARDOWN Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {part.name}
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-cyan-300 bg-teal-950/70 border border-teal-500/40 rounded uppercase shadow-sm">
                {part.status}
              </span>
            </div>

            {/* Engineer Assigned Subtitle */}
            <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-teal-400 mt-1 uppercase">
              ENGINEER ASSIGNED: <span className="text-cyan-300 font-bold">{part.engineer}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Save Details + Theme Switch */}
        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white border border-emerald-400'
                : 'bg-[#0f2430]/90 hover:bg-[#153445] text-cyan-300 border border-teal-700/60 hover:border-cyan-400'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>SAVED!</span>
              </>
            ) : (
              <>
                <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>SAVE DETAILS</span>
              </>
            )}
          </button>

          {/* Theme Switcher Sun/Moon button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-10 h-10 rounded-full bg-[#10232e]/90 hover:bg-[#163343] border border-teal-700/50 text-cyan-200 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-300 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
