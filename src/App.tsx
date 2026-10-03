import React, { useState } from 'react';
import { TimetableProvider, useTimetable } from './context/TimetableContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TimetableView } from './components/timetable/TimetableView';
import { ClassManagement } from './components/classes/ClassManagement';
import { RoomManagement } from './components/rooms/RoomManagement';
import { InstructorManagement } from './components/instructors/InstructorManagement';
import { ConflictCenter } from './components/conflicts/ConflictCenter';
import { OptimizationStudio } from './components/optimization/OptimizationStudio';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TemplatesView } from './components/templates/TemplatesView';
import { GenerateWizard } from './components/wizard/GenerateWizard';
import { SettingsView } from './components/settings/SettingsView';
import { ToastContainer } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useTimetable();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on landing page, display the dedicated marketing hero and overview
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8FAF8] dark:bg-darkbg-900 transition-colors">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  // Dashboard / Management Views
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] dark:bg-darkbg-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'timetable' && <TimetableView />}
          {activeTab === 'classes' && <ClassManagement />}
          {activeTab === 'rooms' && <RoomManagement />}
          {activeTab === 'instructors' && <InstructorManagement />}
          {activeTab === 'conflicts' && <ConflictCenter />}
          {activeTab === 'optimization' && <OptimizationStudio />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'templates' && <TemplatesView />}
          {activeTab === 'wizard' && <GenerateWizard />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TimetableProvider>
      <AppContent />
    </TimetableProvider>
  );
};

export default App;
