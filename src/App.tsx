import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PortalRouter } from './components/portal/PortalRouter';
import { OrganizerApp } from './components/organizer/OrganizerApp';
import { SuperAdminApp } from './components/admin/SuperAdminApp';

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
import { DiscoverEcosystemView } from './components/discovery/DiscoverEcosystemView';
import { ProjectsEcosystemView } from './components/projects/ProjectsEcosystemView';
import { WorkspaceView } from './components/team/WorkspaceView';
import { MentorDirectoryView } from './components/mentors/MentorDirectoryView';
import { EventsDirectoryView } from './components/events/EventsDirectoryView';
import { ResearchHubView } from './components/research/ResearchHubView';
import { AskCampusView } from './components/community/AskCampusView';
import { CampusStoriesView } from './components/community/CampusStoriesView';
import { CertificateVerifyView } from './components/certificates/CertificateVerifyView';
import { StudentDashboardView } from './components/dashboard/StudentDashboardView';
import { MentorDashboardView } from './components/dashboard/MentorDashboardView';
import { PhDScholarDashboardView } from './components/dashboard/PhDScholarDashboardView';
import { StudentPortfolioView } from './components/dashboard/StudentPortfolioView';

// Modals & Overlays
import { AuthPortalModal } from './components/auth/AuthPortalModal';
import { StudentRegistrationModal } from './components/auth/StudentRegistrationModal';
import { MentorOnboardingModal } from './components/auth/MentorOnboardingModal';
import { VideoCallModal } from './components/workspace/VideoCallModal';
import { CampusAIAssistant } from './components/ai/CampusAIAssistant';
import { DirectMessagingModal } from './components/messaging/DirectMessagingModal';
import { UserProfileModal } from './components/network/UserProfileModal';

const MainContent: React.FC = () => {
  const { activeTab, activeRole } = useApp();

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

        {activeTab === 'discover' && <DiscoverEcosystemView />}
        {activeTab === 'projects' && <ProjectsEcosystemView />}
        {activeTab === 'events' && <EventsDirectoryView />}
        {activeTab === 'mentors' && <MentorDirectoryView />}
        {activeTab === 'research' && <ResearchHubView />}
        {activeTab === 'workspace' && <WorkspaceView />}
        
        {/* Dynamic Role Dashboard Routing for Public Platform */}
        {activeTab === 'dashboard' && (
          <>
            {activeRole === 'student' && <StudentDashboardView />}
            {activeRole === 'mentor' && <MentorDashboardView />}
            {activeRole === 'researcher' && <PhDScholarDashboardView />}
          </>
        )}

        {activeTab === 'portfolio' && <StudentPortfolioView />}
        {activeTab === 'certificates' && <CertificateVerifyView />}
        {activeTab === 'ask' && <AskCampusView />}
        {activeTab === 'stories' && <CampusStoriesView />}
      </div>

      <Footer />
    </main>
  );
};

const PublicCampusNetApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-campus-warm-white text-campus-slate-text">
      <Navbar />
      <MainContent />
      <MobileNav />

      {/* Global Public Overlays & Modals */}
      <ToastContainer />
      <AuthPortalModal />
      <StudentRegistrationModal />
      <MentorOnboardingModal />
      <VideoCallModal />
      <CampusAIAssistant />
      <DirectMessagingModal />
      <UserProfileModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <PortalRouter
        publicApp={<PublicCampusNetApp />}
        organizerApp={<OrganizerApp />}
        adminApp={<SuperAdminApp />}
      />
    </AppProvider>
  );
}

export default App;
