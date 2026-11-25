import React, { useState } from 'react';
import { PageId } from '../types/lifex';
import { ChevronLeft, ChevronRight, Layers, Eye, Wrench, Menu, X } from 'lucide-react';

interface PageMasterStepperProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenTeardownRegistry: () => void;
}

export const PAGE_NAMES: Record<number, string> = {
  1: '1. Landing Page',
  2: '2. Sign Up',
  3: '3. Login',
  4: '4. Dashboard',
  5: '5. Vehicle Selection',
  6: '6. Vehicle Configuration',
  7: '7. Vehicle Architecture',
  8: '8. Rear Suspension Assembly',
  11: '11. Suspension Components',
  13: '13. Communications',
  14: '14. Communication Summary',
  15: '15. Lifecycle Documents',
  16: '16. RFI Form (Example)',
  17: '17. Final Engineering Report',
  18: '18. Tree Navigation',
  19: '19. BandView',
  20: '20. Settings / Profile',
  21: '21. 404 Page',
  22: 'Teardown Registry (Ford Titanium)',
  23: '23. Engineering Workspace',
  24: '24. Working Limits',
  25: '25. Reference Applications',
  26: '26. New Application Assistant',
};

export const PageMasterStepper: React.FC<PageMasterStepperProps> = ({
  currentPage,
  onNavigate,
  onOpenTeardownRegistry,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const workflowPages = [1,2,3,4,5,6,7,8,11,13,14,15,23];
  const isMainWorkflow = workflowPages.includes(currentPage);

  const handlePrev = () => {
    if ([24, 25, 26].includes(currentPage)) { onNavigate(23); return; }
    const index = workflowPages.indexOf(currentPage);
    if (index > 0) {
      onNavigate(workflowPages[index - 1] as PageId);
    } else if (currentPage > 17) {
      onNavigate(17);
    }
  };

  const handleNext = () => {
    const index = workflowPages.indexOf(currentPage);
    if (index >= 0 && index < workflowPages.length - 1) {
      onNavigate(workflowPages[index + 1] as PageId);
    }
  };

  return (
    <aside aria-label="Page Navigation" className="sticky top-0 z-50 bg-[#07131d]/95 backdrop-blur-md border-b border-teal-800/50 shadow-lg text-white">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Shared LIFEX identity appears in the top-left header across application pages. */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex h-10 items-center rounded-lg bg-white px-2.5 shadow-sm">
            <img src="/lifex-logo.png" alt="LIFEX" className="h-9 w-[112px] object-contain" />
          </div>
          {/* Stepper controls */}
          <div className="flex items-center bg-[#0a1b2a] border border-teal-700/60 rounded-lg p-0.5">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              title="Previous Page (ArrowLeft)"
              className="p-1 sm:p-1.5 text-teal-300 hover:text-cyan-200 hover:bg-teal-900/50 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-2 sm:px-3 py-1 font-mono text-cyan-200 font-semibold flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-white">{PAGE_NAMES[currentPage] || `Page ${currentPage}`}</span>
              {isMainWorkflow && (
                <span className="text-teal-400 text-[10px]">({workflowPages.indexOf(currentPage) + 1}/{workflowPages.length})</span>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === 23 || currentPage === 17}
              title="Next Page (ArrowRight)"
              className="p-1 sm:p-1.5 text-teal-300 hover:text-cyan-200 hover:bg-teal-900/50 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump dropdown */}
          <select
            value={currentPage}
            onChange={(e) => onNavigate(Number(e.target.value) as PageId)}
            className="bg-[#0a1c2b] border border-teal-700/60 text-cyan-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer hidden md:block max-w-[210px] truncate"
          >
            {workflowPages.map((num) => (
              <option key={num} value={num} className="bg-[#0d1e2e] text-slate-100">
                {PAGE_NAMES[num]}
              </option>
            ))}
            <option disabled className="bg-slate-900 text-slate-500">── Extra Views ──</option>
            <option value={18} className="bg-[#0d1e2e] text-slate-100">18. Tree Navigation</option>
            <option value={19} className="bg-[#0d1e2e] text-slate-100">19. BandView</option>
            <option value={20} className="bg-[#0d1e2e] text-slate-100">20. Settings / Profile</option>
            <option value={21} className="bg-[#0d1e2e] text-slate-100">21. 404 Not Found</option>
            <option disabled className="bg-slate-900 text-slate-500">── Engineering Workspaces ──</option>
            <option value={24} className="bg-[#0d1e2e] text-slate-100">24. Working Limits</option>
            <option value={25} className="bg-[#0d1e2e] text-slate-100">25. Reference Applications</option>
            <option value={26} className="bg-[#0d1e2e] text-slate-100">26. New Application Assistant</option>
            <option value={16} className="bg-[#0d1e2e] text-slate-100">16. RFI Form (Example)</option>
            <option value={17} className="bg-[#0d1e2e] text-slate-100">17. Final Engineering Report</option>
            <option value={22} className="bg-[#0d1e2e] text-cyan-300 font-semibold">Teardown Registry (Ford)</option>
          </select>
        </div>

        {/* Center: Quick workflow page pills for desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {workflowPages.map((num) => {
            const isActive = currentPage === num;
            return (
              <button
                key={num}
                onClick={() => onNavigate(num as PageId)}
                title={PAGE_NAMES[num]}
                className={`w-6 h-6 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-[#041019] font-bold shadow-sm shadow-cyan-400/50 scale-110'
                    : 'text-teal-300 hover:text-white hover:bg-teal-900/40'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Right side: Teardown Registry + Extra Views switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(22)}
            title="Open Teardown Registry (Ford Titanium 2026)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              currentPage === 22
                ? 'bg-cyan-500 text-[#040e17] shadow-sm shadow-cyan-500/50'
                : 'bg-teal-950/80 hover:bg-teal-900/80 border border-teal-600/50 text-cyan-300'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teardown Registry</span>
          </button>

          <button
            onClick={() => onNavigate(18)}
            title="Tree Navigation"
            className="p-1.5 text-teal-300 hover:text-cyan-200 hover:bg-teal-900/50 rounded-lg transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
