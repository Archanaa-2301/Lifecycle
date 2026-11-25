import React from 'react';

export type ActiveTab = 'EXISTING_PART_DETAIL' | 'IDEA_SCORE_CARD' | 'HISTORY';

interface TabsHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ideaCount: number;
  historyCount: number;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  activeTab,
  onTabChange,
  ideaCount,
  historyCount,
}) => {
  return (
    <div className="px-4 sm:px-8 border-b border-teal-900/40">
      <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none">
        {/* EXISTING PART DETAIL Tab */}
        <button
          onClick={() => onTabChange('EXISTING_PART_DETAIL')}
          className={`py-3 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-colors relative cursor-pointer ${
            activeTab === 'EXISTING_PART_DETAIL'
              ? 'text-cyan-400'
              : 'text-teal-400/60 hover:text-cyan-300'
          }`}
        >
          EXISTING PART DETAIL
          {activeTab === 'EXISTING_PART_DETAIL' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 rounded-t-full shadow-sm shadow-cyan-400" />
          )}
        </button>

        {/* IDEA & SCORE CARD Tab */}
        <button
          onClick={() => onTabChange('IDEA_SCORE_CARD')}
          className={`py-3 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-colors relative cursor-pointer ${
            activeTab === 'IDEA_SCORE_CARD'
              ? 'text-cyan-400'
              : 'text-teal-400/60 hover:text-cyan-300'
          }`}
        >
          IDEA &amp; SCORE CARD
          {ideaCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-950 text-cyan-300 border border-teal-700/60">
              {ideaCount}
            </span>
          )}
          {activeTab === 'IDEA_SCORE_CARD' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 rounded-t-full shadow-sm shadow-cyan-400" />
          )}
        </button>

        {/* HISTORY (X) Tab */}
        <button
          onClick={() => onTabChange('HISTORY')}
          className={`py-3 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-colors relative cursor-pointer ${
            activeTab === 'HISTORY'
              ? 'text-cyan-400'
              : 'text-teal-400/60 hover:text-cyan-300'
          }`}
        >
          HISTORY ({historyCount})
          {activeTab === 'HISTORY' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 rounded-t-full shadow-sm shadow-cyan-400" />
          )}
        </button>
      </div>
    </div>
  );
};
