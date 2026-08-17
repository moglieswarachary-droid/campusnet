import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

// Landing Sections
import { HeroSection } from './components/landing/HeroSection';
import { InstitutionsTicker } from './components/landing/InstitutionsTicker';
import { HackathonsSection } from './components/landing/HackathonsSection';
import { TeamMatchingSection } from './components/landing/TeamMatchingSection';
import { MentorMatchingSection } from './components/landing/MentorMatchingSection';
import { ProjectsExplorerSection } from './components/landing/ProjectsExplorerSection';
import { ResearchNetworkSection } from './components/landing/ResearchNetworkSection';
import { StoriesSection } from './components/landing/StoriesSection';
import { GovtChallengesSection } from './components/landing/GovtChallengesSection';
import { CampusAIPromotion } from './components/landing/CampusAIPromotion';
import { CTASection } from './components/landing/CTASection';

// Hub Views
import { TeamFormationView } from './components/team/TeamFormationView';
import { WorkspaceView } from './components/team/WorkspaceView';
import { MentorDirectoryView } from './components/mentors/MentorDirectoryView';
import { EventsDirectoryView } from './components/events/EventsDirectoryView';
import { ResearchHubView } from './components/research/ResearchHubView';
import { AskCampusView } from './components/community/AskCampusView';
import { CampusStoriesView } from './components/community/CampusStoriesView';
import { CertificateVerifyView } from './components/certificates/CertificateVerifyView';
import { StudentDashboardView } from './components/dashboard/StudentDashboardView';
import { StudentPortfolioView } from './components/dashboard/StudentPortfolioView';
import { HiddenAdminPortal } from './components/admin/HiddenAdminPortal';

// Modals & Overlays
import { StudentRegistrationModal } from './components/auth/StudentRegistrationModal';
import { MentorOnboardingModal } from './components/auth/MentorOnboardingModal';
import { VideoCallModal } from './components/workspace/VideoCallModal';
import { CampusAIAssistant } from './components/ai/CampusAIAssistant';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <InstitutionsTicker />
            <HackathonsSection />
            <TeamMatchingSection />
            <MentorMatchingSection />
            <ProjectsExplorerSection />
            <ResearchNetworkSection />
            <StoriesSection />
            <GovtChallengesSection />
            <CampusAIPromotion />
            <CTASection />
          </>
        )}

        {activeTab === 'discover' && <TeamFormationView />}
        {activeTab === 'projects' && <TeamFormationView />}
        {activeTab === 'events' && <EventsDirectoryView />}
        {activeTab === 'mentors' && <MentorDirectoryView />}
        {activeTab === 'research' && <ResearchHubView />}
        {activeTab === 'workspace' && <WorkspaceView />}
        {activeTab === 'dashboard' && <StudentDashboardView />}
        {activeTab === 'portfolio' && <StudentPortfolioView />}
        {activeTab === 'certificates' && <CertificateVerifyView />}
        {activeTab === 'ask' && <AskCampusView />}
        {activeTab === 'stories' && <CampusStoriesView />}
        {activeTab === 'admin' && <HiddenAdminPortal />}
      </div>

      <Footer />
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-campus-warm-white text-campus-slate-text">
        <Navbar />
        <MainContent />
        <MobileNav />

        {/* Global Overlays & Modals */}
        <ToastContainer />
        <StudentRegistrationModal />
        <MentorOnboardingModal />
        <VideoCallModal />
        <CampusAIAssistant />
      </div>
    </AppProvider>
  );
}

export default App;
