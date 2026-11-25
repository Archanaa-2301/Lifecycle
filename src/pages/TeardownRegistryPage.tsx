import React, { useState, useEffect } from 'react';
import { PageId } from '../types/lifex';
import { TeardownPart, TeardownIdea, HistoryEntry } from '../types/teardown';
import { INITIAL_PARTS } from '../data/initialParts';
import { Header } from '../components/Header';
import { TabsHeader, ActiveTab } from '../components/TabsHeader';
import { PartNavigationToolbar } from '../components/PartNavigationToolbar';
import { BrowserAddressBar } from '../components/BrowserAddressBar';
import { FordWatermark } from '../components/FordWatermark';
import { ExistingPartDetailTab } from '../components/teardown/ExistingPartDetailTab';
import { IdeaScoreCardTab } from '../components/teardown/IdeaScoreCardTab';
import { HistoryTab } from '../components/teardown/HistoryTab';
import { RegistryDrawerModal } from '../components/teardown/RegistryDrawerModal';
import { Code, ArrowLeft } from 'lucide-react';

interface TeardownRegistryPageProps {
  onNavigate: (page: PageId) => void;
}

export const TeardownRegistryPage: React.FC<TeardownRegistryPageProps> = ({ onNavigate }) => {
  // Load parts from localStorage if available, or fall back to INITIAL_PARTS
  const [parts, setParts] = useState<TeardownPart[]>(() => {
    try {
      const saved = localStorage.getItem('clavis_teardown_parts_17');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_PARTS;
  });

  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('EXISTING_PART_DETAIL');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showRegistryModal, setShowRegistryModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clavis_teardown_parts_17', JSON.stringify(parts));
    } catch (e) {
      // ignore
    }
  }, [parts]);

  const currentPart = parts[currentPartIndex] || parts[0];

  const handleUpdateCurrentPart = (updatedFields: Partial<TeardownPart>) => {
    setParts((prev) => {
      const copy = [...prev];
      copy[currentPartIndex] = { ...copy[currentPartIndex], ...updatedFields };
      return copy;
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Add a history entry
      const histEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        author: currentPart.engineer || 'ARCHANAA',
        action: `Teardown specifications saved & validated by Engineer ${currentPart.engineer}.`,
      };

      setParts((prev) => {
        const copy = [...prev];
        const p = copy[currentPartIndex];
        copy[currentPartIndex] = {
          ...p,
          history: [histEntry, ...p.history],
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        return copy;
      });

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  const handleAddIdea = (newIdea: TeardownIdea) => {
    setParts((prev) => {
      const copy = [...prev];
      const p = copy[currentPartIndex];
      copy[currentPartIndex] = {
        ...p,
        ideas: [newIdea, ...p.ideas],
      };
      return copy;
    });
  };

  const handleAddHistory = (entry: HistoryEntry) => {
    setParts((prev) => {
      const copy = [...prev];
      const p = copy[currentPartIndex];
      copy[currentPartIndex] = {
        ...p,
        history: [entry, ...p.history],
      };
      return copy;
    });
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const browserUrl = `http://localhost:5173/clavis/vehicles/6/registry/engine-power-unit/cylinder-block-assembly/${encodeURIComponent(
    currentPart.name
  )}/teardown`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#040b12] text-slate-100' : 'bg-slate-100 text-slate-900'} relative flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors`}>
      {/* 1. Browser Address Bar matching exact screenshot */}
      <BrowserAddressBar
        currentUrl={browserUrl}
        onRefresh={() => {
          setParts(INITIAL_PARTS);
        }}
        onPrev={() => setCurrentPartIndex((idx) => Math.max(0, idx - 1))}
        onNext={() => setCurrentPartIndex((idx) => Math.min(parts.length - 1, idx + 1))}
        canPrev={currentPartIndex > 0}
        canNext={currentPartIndex < parts.length - 1}
      />

      {/* 2. 17 Pages Stepper Navigation Toolbar */}
      <PartNavigationToolbar
        parts={parts}
        currentPartIndex={currentPartIndex}
        onSelectPart={(idx) => setCurrentPartIndex(idx)}
        onOpenRegistryModal={() => setShowRegistryModal(true)}
      />

      {/* 3. Main Header matching exact screenshot */}
      <div className="max-w-[1700px] mx-auto w-full">
        <Header
          part={currentPart}
          onSave={handleSave}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          theme={theme}
          onToggleTheme={toggleTheme}
          onPrev={() => onNavigate(4)}
        />

        {/* 4. Tabs Header: EXISTING PART DETAIL | IDEA & SCORE CARD | HISTORY (X) */}
        <TabsHeader
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          ideaCount={currentPart.ideas.length}
          historyCount={currentPart.history.length}
        />

        {/* 5. Main Card with Embossed Ford Watermark Emblem */}
        <main className="p-4 sm:p-8">
          <div className="relative rounded-2xl border border-teal-800/40 bg-[#07131e]/85 backdrop-blur-md p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[580px]">
            {/* Center Embossed Ford Oval Script Logo */}
            <FordWatermark className="top-10 sm:top-14 left-1/2 -translate-x-1/2" />

            {/* Tab Body */}
            <div className="relative z-10">
              {activeTab === 'EXISTING_PART_DETAIL' && (
                <ExistingPartDetailTab
                  part={currentPart}
                  onUpdatePart={handleUpdateCurrentPart}
                />
              )}

              {activeTab === 'IDEA_SCORE_CARD' && (
                <IdeaScoreCardTab
                  part={currentPart}
                  onAddIdea={handleAddIdea}
                />
              )}

              {activeTab === 'HISTORY' && (
                <HistoryTab
                  part={currentPart}
                  onAddHistory={handleAddHistory}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 6. Floating Action Button at Bottom Right (as in screenshot with <>) */}
      <button
        onClick={() => setShowRegistryModal(true)}
        title="Open 17-Part Teardown Registry"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-600/40 hover:scale-110 transition-all cursor-pointer border border-cyan-300/40"
      >
        <Code className="w-5 h-5" />
      </button>

      {/* 7. All 17 Parts Registry Drawer Modal */}
      <RegistryDrawerModal
        isOpen={showRegistryModal}
        onClose={() => setShowRegistryModal(false)}
        parts={parts}
        currentPartIndex={currentPartIndex}
        onSelectPart={(idx) => setCurrentPartIndex(idx)}
      />
    </div>
  );
};
