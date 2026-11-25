
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PageId, Vehicle, LifecycleDoc } from './types/lifex';

import { VEHICLES, LIFECYCLE_DOCS } from './data/lifexData';

import { PageMasterStepper } from './components/PageMasterStepper';

// Primary Pages
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EngineeringRepositoryPage } from './pages/EngineeringRepositoryPage';
import { KnowledgeRepositoryPage } from './pages/KnowledgeRepositoryPage';
import { GlobalRepositoryBrowserPage } from './pages/GlobalRepositoryBrowserPage';
import { ProjectDetailsEntryPage } from './pages/ProjectDetailsEntryPage';
import SelectProjectPage from './pages/SelectProjectPage';
import { VehicleSelectionPage } from './pages/VehicleSelectionPage';
import { OEVehicleSelectionPage } from './pages/OEVehicleSelectionPage';
import { OEMSelectionPage } from './pages/OEMSelectionPage';
import { VehicleOverview3DPage } from './pages/VehicleOverview3DPage';
import { VehicleConfigPage } from './pages/VehicleConfigPage';
import { VehicleArchitecturePage } from './pages/VehicleArchitecturePage';
import { RearSuspensionAssemblyPage } from './pages/RearSuspensionAssemblyPage';
import { RearSuspensionComponentSelectionPage } from './pages/RearSuspensionComponentSelectionPage';
import { ComponentWorkspacePage } from './pages/ComponentWorkspacePage';
import { ComponentRepositoryPage } from './pages/ComponentRepositoryPage';
import { RepositoryManualEntryPage } from './pages/RepositoryManualEntryPage';
import { CommunicationSummaryPage } from './pages/CommunicationSummaryPage';
import { LifecycleDocumentsPage } from './pages/LifecycleDocumentsPage';
import { InternalPartsPage } from './pages/InternalPartsPage';
import { LifecycleDocumentFormPage, EngineeringReportData } from './pages/LifecycleDocumentFormPage';
import { FinalEngineeringReportPage } from './pages/FinalEngineeringReportPage';

// Additional Screens
import { TreeNavigationPage } from './pages/TreeNavigationPage';
import { BandViewPage } from './pages/BandViewPage';
import { SettingsProfilePage } from './pages/SettingsProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TeardownRegistryPage } from './pages/TeardownRegistryPage';
import { EngineeringWorkspacePage } from './pages/EngineeringWorkspacePage';
import { WorkingLimitsPage } from './pages/WorkingLimitsPage';
import { ReferenceApplicationsPage } from './pages/ReferenceApplicationsPage';
import { NewApplicationChatbotPage } from './pages/NewApplicationChatbotPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(1);
  // Keep a real in-app navigation trail so Back always returns to the page
  // the employee actually visited, rather than an unrelated hard-coded page.
  const pageHistoryRef = useRef<PageId[]>([1]);
  const navigateToPage = (page: PageId) => {
    if (page === currentPage) return;
    const history = pageHistoryRef.current;
    const previousIndex = history.lastIndexOf(page);
    if (previousIndex >= 0 && previousIndex < history.length - 1) {
      pageHistoryRef.current = history.slice(0, previousIndex + 1);
    } else {
      pageHistoryRef.current = [...history, currentPage, page].filter((item, index, list) => index === 0 || item !== list[index - 1]);
    }
    setCurrentPage(page);
  };

  const goBackOnePage = () => {
    const history = pageHistoryRef.current;
    if (history.length > 1) {
      const nextHistory = history.slice(0, -1);
      pageHistoryRef.current = nextHistory;
      setCurrentPage(nextHistory[nextHistory.length - 1]);
      return;
    }
    navigateToPage(4);
  };

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle>(VEHICLES[0]);

  const [selectedComponentIndex, setSelectedComponentIndex] = useState(0);
  const [selectedLifecycleDoc, setSelectedLifecycleDoc] = useState<LifecycleDoc>(LIFECYCLE_DOCS[0]);
  const [engineeringReportData, setEngineeringReportData] = useState<EngineeringReportData | null>(null);

  // Cinematic transitions across vehicle setup and component knowledge (5 -> 6 -> 7 -> 8 -> 11 -> 13 -> 14 -> 15).
  const [activeVehicleTransition, setActiveVehicleTransition] =
    useState<6 | 7 | 8 | 11 | 13 | 14 | 15 | 23 | 24 | 25 | 26 | null>(null);

  // All page navigation now uses the same history-aware route handler.
  const handleVehicleWorkflowNavigation = (page: PageId) => navigateToPage(page);

  const transitionCopy = {
    6: { title: 'Configuring Vehicle Workspace', description: 'Loading vehicle specifications and engineering configuration…', status: 'INITIALIZING SYSTEM DATA' },
    7: { title: 'Generating Vehicle Architecture', description: 'Mapping vehicle systems, assemblies and engineering relationships…', status: 'BUILDING ARCHITECTURE MODEL' },
    8: { title: 'Opening Rear Suspension Assembly', description: 'Preparing assembly structure, component relationships and engineering views…', status: 'LOADING ASSEMBLY INTELLIGENCE' },
    11: { title: 'Opening Component Knowledge Library', description: 'Loading six component-specific engineering workspaces and visual references…', status: 'INDEXING COMPONENT KNOW-HOW' },
    13: { title: 'Opening Component Workspace', description: 'Preparing the three engineering entry points for the selected component…', status: 'LOADING COMPONENT WORKSPACE' },
    14: { title: 'Synthesizing Component Intelligence', description: 'Summarizing component-specific requirements, engineering risks and verification focus…', status: 'BUILDING COMPONENT SUMMARY' },
    15: { title: 'Opening Lifecycle Document Library', description: 'Loading the original APQP lifecycle documents with relevance to the selected component…', status: 'INDEXING LIFECYCLE DOCUMENTS' },
    23: { title: 'Opening Engineering Workspace', description: 'Choose working limits, reference applications or evaluate a new customer application…', status: 'PREPARING ENGINEERING DECISION TOOLS' },
    24: { title: 'Loading Component Working Limits', description: 'Preparing load cases, material requirements and validation constraints for the selected component…', status: 'LOADING DESIGN CONSTRAINTS' },
    25: { title: 'Loading Reference Applications', description: 'Preparing Ford and Mercedes reference application comparison views…', status: 'INDEXING REFERENCE DESIGNS' },
    26: { title: 'Opening New Application Assistant', description: 'Preparing the SOR intake and closest-design matching conversation…', status: 'INITIALIZING APPLICATION ASSISTANT' },
  } as const;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && e.altKey) {
        goBackOnePage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage]);

  // Reset teardown data
  const handleResetData = () => {
    localStorage.removeItem('clavis_teardown_parts_17');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* GLOBAL HEADER / PAGE STEPPER

          Hidden on:
          Page 1 - Landing Page
          Page 3 - Login (full-screen alignment)
          Page 4 - Dashboard

          The logo is reserved for the Landing and Login pages.
      */}

      {currentPage !== 1 && currentPage !== 3 && currentPage !== 4 && currentPage !== 5 && currentPage !== 27 && currentPage !== 28 && currentPage !== 29 && currentPage !== 30 && currentPage !== 33 && currentPage !== 34 && currentPage !== 11 && currentPage !== 13 && currentPage !== 16 && currentPage !== 31 && currentPage !== 32 && currentPage !== 35 && currentPage !== 14 && currentPage !== 15 && currentPage !== 23 && currentPage !== 24 && currentPage !== 25 && currentPage !== 26 && ( 
        <PageMasterStepper
          currentPage={currentPage}
          onNavigate={handleVehicleWorkflowNavigation}
          onOpenTeardownRegistry={() => navigateToPage(22)}
        />
      )}

      {/* PAGE CONTENT */}

      <div key={currentPage} className="flex-1 flex flex-col lifex-page-enter">

        {/* PAGE 1 - LANDING */}

        {currentPage === 1 && (
          <LandingPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 2 - SIGN UP */}

        {currentPage === 2 && (
          <SignUpPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 3 - LOGIN */}

        {currentPage === 3 && (
          <LoginPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 4 - DASHBOARD */}

        {currentPage === 4 && (
          <DashboardPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 27 - ENGINEERING REPOSITORY LANDING */}
        {currentPage === 27 && (
          <EngineeringRepositoryPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 28 - DETAILED KNOWLEDGE REPOSITORY */}
        {currentPage === 28 && (
          <KnowledgeRepositoryPage
            componentIndex={selectedComponentIndex}
            onNavigate={navigateToPage}
            backPage={29}
          />
        )}

        {/* PAGE 29 - GLOBAL REPOSITORY: CATEGORY -> COMPONENT -> PDF DOCUMENTS */}
        {currentPage === 29 && (
          <GlobalRepositoryBrowserPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 30 - SELECT PROJECT */}
        {currentPage === 30 && (
          <SelectProjectPage
            onBack={() => goBackOnePage()}
            onProjectEnter={(project) => {
              localStorage.setItem('lifex-project-preset', JSON.stringify({
                id: project.code,
                code: project.code,
                name: project.name,
                platform: project.platform,
                oems: project.oems,
                vehicleType: project.vehicleType,
                vehicleModel: project.vehicleModel,
                projectType: project.projectType,
                initiatedOn: project.initiatedOn,
                description: project.description,
                image: project.image,
              }));
              navigateToPage(33);
            }}
          />
        )}

        {/* PAGE 33 - PROJECT DETAILS ENTRY */}
        {currentPage === 33 && (
          <ProjectDetailsEntryPage onNavigate={navigateToPage} />
        )}

        {/* Legacy vehicle setup pages remain available only outside the approved direct-to-suspension flow. */}

        {/* PAGE 35 - OEM SELECTION */}
        {currentPage === 35 && (
          <OEMSelectionPage
            onBack={() => navigateToPage(27)}
            onSelectOEM={(oem) => {
              const existing = (() => {
                try { return JSON.parse(localStorage.getItem('lifex-project-preset') || '{}'); }
                catch { return {}; }
              })();
              localStorage.setItem('lifex-project-preset', JSON.stringify({
                ...existing,
                oems: [oem],
                vehicleModel: 'Innova'
              }));
              navigateToPage(5);
            }}
          />
        )}

        {/* PAGE 5 - VEHICLE SELECTION */}

        {currentPage === 5 && (
          <OEVehicleSelectionPage onNavigate={handleVehicleWorkflowNavigation} onSelectVehicle={setSelectedVehicle} />
        )}

        {/* PAGE 34 - INTERACTIVE 3D VEHICLE OVERVIEW */}
        {currentPage === 34 && (
          <VehicleOverview3DPage
            vehicle={selectedVehicle}
            onNavigate={handleVehicleWorkflowNavigation}
            onSelectComponent={(index, name) => {
              setSelectedComponentIndex(Math.min(index, 5));
              localStorage.setItem('lifex-selected-component-label', name);
            }}
          />
        )}

        {/* PAGE 6 - VEHICLE CONFIGURATION */}

        {currentPage === 6 && (
          <VehicleConfigPage
            vehicle={selectedVehicle}
            onNavigate={handleVehicleWorkflowNavigation}
          />
        )}

        {/* PAGE 7 - VEHICLE ARCHITECTURE */}

        {currentPage === 7 && (
          <VehicleArchitecturePage onNavigate={handleVehicleWorkflowNavigation} />
        )}

        {/* PAGE 8 - REAR SUSPENSION ASSEMBLY */}

        {currentPage === 8 && (
          <RearSuspensionAssemblyPage
            onNavigate={(page) => handleVehicleWorkflowNavigation(page === 9 || page === 10 ? 11 : page)}
          />
        )}

        {/* PAGE 9 AND PAGE 10 REMOVED FROM THIS WORKFLOW */}

        {/* PAGE 11 - SIX COMPONENT CARDS OPEN AFTER ANY REAR SUSPENSION CALLOUT */}
        {currentPage === 11 && (
          <RearSuspensionComponentSelectionPage
            onNavigate={navigateToPage}
            onSelectComponent={(index, name) => {
              setSelectedComponentIndex(Math.min(index, 5));
              localStorage.setItem('lifex-selected-component-label', name);
              navigateToPage(13);
            }}
          />
        )}

        {/* PAGE 12 - INTERNAL PARTS */}

        {currentPage === 12 && (
          <InternalPartsPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 13 - COMPONENT WORKSPACE: repository navigation + unchanged intelligence extraction */}
        {currentPage === 13 && (
          <ComponentWorkspacePage componentIndex={selectedComponentIndex} onNavigate={navigateToPage} />
        )}

        {/* PAGE 31 - DEDICATED REPOSITORY PAGE: DOCUMENTS + MANUAL ENTRY */}
        {currentPage === 31 && (
          <ComponentRepositoryPage componentIndex={selectedComponentIndex} onNavigate={navigateToPage} />
        )}

        {/* PAGE 32 - DEDICATED MANUAL ENTRY WORKFLOW SELECTION */}
        {currentPage === 32 && (
          <RepositoryManualEntryPage componentIndex={selectedComponentIndex} onNavigate={navigateToPage} onSelectDoc={setSelectedLifecycleDoc} />
        )}

        {/* PAGE 14 - COMPONENT COMMUNICATION SUMMARY */}
        {currentPage === 14 && (
          <CommunicationSummaryPage componentIndex={selectedComponentIndex} onNavigate={handleVehicleWorkflowNavigation} />
        )}

        {/* PAGE 15 - ORIGINAL LIFECYCLE DOCUMENT LIBRARY, COMPONENT-CONTEXTUALIZED */}
        {currentPage === 15 && (
          <LifecycleDocumentsPage componentIndex={selectedComponentIndex} onNavigate={handleVehicleWorkflowNavigation} onSelectDoc={setSelectedLifecycleDoc} />
        )}

        {/* PAGE 23 - ENGINEERING WORKSPACE NAVIGATION AFTER THE LIFECYCLE LIBRARY */}
        {currentPage === 23 && (
          <EngineeringWorkspacePage componentIndex={selectedComponentIndex} onNavigate={handleVehicleWorkflowNavigation} />
        )}

        {/* PAGE 24 - COMPONENT WORKING LIMITS */}
        {currentPage === 24 && (
          <WorkingLimitsPage componentIndex={selectedComponentIndex} onNavigate={handleVehicleWorkflowNavigation} />
        )}

        {/* PAGE 25 - FORD / MERCEDES REFERENCE APPLICATIONS */}
        {currentPage === 25 && (
          <ReferenceApplicationsPage componentIndex={selectedComponentIndex} onNavigate={handleVehicleWorkflowNavigation} />
        )}

        {/* PAGE 26 - NEW APPLICATION SOR CHATBOT */}
        {currentPage === 26 && (
          <NewApplicationChatbotPage componentIndex={selectedComponentIndex} onNavigate={handleVehicleWorkflowNavigation} />
        )}

        {/* PAGE 16 - RFI FORM */}

        {currentPage === 16 && (
          <LifecycleDocumentFormPage componentIndex={selectedComponentIndex} doc={selectedLifecycleDoc} onNavigate={navigateToPage} onGenerateReport={setEngineeringReportData} backPage={32} />
        )}

        {/* PAGE 17 - FINAL ENGINEERING REPORT */}

        {currentPage === 17 && (
          <FinalEngineeringReportPage onNavigate={navigateToPage} reportData={engineeringReportData} />
        )}

        {/* ADDITIONAL SCREENS */}

        {/* PAGE 18 - TREE NAVIGATION */}

        {currentPage === 18 && (
          <TreeNavigationPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 19 - BAND VIEW */}

        {currentPage === 19 && (
          <BandViewPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 20 - SETTINGS */}

        {currentPage === 20 && (
          <SettingsProfilePage
            onNavigate={navigateToPage}
            onResetData={handleResetData}
          />
        )}

        {/* PAGE 21 - NOT FOUND */}

        {currentPage === 21 && (
          <NotFoundPage onNavigate={navigateToPage} />
        )}

        {/* PAGE 22 - TEARDOWN REGISTRY */}

        {currentPage === 22 && (
          <TeardownRegistryPage onNavigate={navigateToPage} />
        )}

      </div>

      {activeVehicleTransition !== null && (
        <div className="lifex-vehicle-transition" role="status" aria-live="polite">
          <div className="lifex-vehicle-transition-content">
            <div className="lifex-vehicle-scanner">
              <span className="lifex-vehicle-scanner-ring lifex-ring-one" />
              <span className="lifex-vehicle-scanner-ring lifex-ring-two" />
              <span className="lifex-vehicle-scanner-core">
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M8 27.5 11.5 18a4 4 0 0 1 3.8-2.7h17.4a4 4 0 0 1 3.8 2.7L40 27.5v8a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2H14v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-8Z" />
                  <path d="M12 26h24M15 20h18M15 31h.1M33 31h.1" />
                </svg>
              </span>
              <span className="lifex-vehicle-scan-line" />
            </div>
            <p className="lifex-vehicle-kicker">LIFEX / VEHICLE INTELLIGENCE</p>
            <h2>{transitionCopy[activeVehicleTransition].title}</h2>
            <p className="lifex-vehicle-description">
              {transitionCopy[activeVehicleTransition].description}
            </p>
            <div className="lifex-vehicle-progress"><span /></div>
            <span className="lifex-vehicle-status">{transitionCopy[activeVehicleTransition].status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
