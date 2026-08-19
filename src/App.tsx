import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { PortalRouter } from './components/portal/PortalRouter';
import { LoadingFallback } from './components/common/LoadingFallback';

import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

// Landing Sections (Critical Path)
import { LandingPageView } from './components/landing/LandingPageView';

// Lazy Loaded Portals & Apps
const OrganizerApp = lazy(() => import('./components/organizer/OrganizerApp').then(m => ({ default: m.OrganizerApp })));
const SuperAdminApp = lazy(() => import('./components/admin/SuperAdminApp').then(m => ({ default: m.SuperAdminApp })));

// Lazy Loaded Public Hub Views
const DiscoverEcosystemView = lazy(() => import('./components/discovery/DiscoverEcosystemView').then(m => ({ default: m.DiscoverEcosystemView })));
const ProjectsEcosystemView = lazy(() => import('./components/projects/ProjectsEcosystemView').then(m => ({ default: m.ProjectsEcosystemView })));
const WorkspaceView = lazy(() => import('./components/team/WorkspaceView').then(m => ({ default: m.WorkspaceView })));
const MentorDirectoryView = lazy(() => import('./components/mentors/MentorDirectoryView').then(m => ({ default: m.MentorDirectoryView })));
const EventsDirectoryView = lazy(() => import('./components/events/EventsDirectoryView').then(m => ({ default: m.EventsDirectoryView })));
const ResearchHubView = lazy(() => import('./components/research/ResearchHubView').then(m => ({ default: m.ResearchHubView })));
const AskCampusView = lazy(() => import('./components/community/AskCampusView').then(m => ({ default: m.AskCampusView })));
const CampusStoriesView = lazy(() => import('./components/community/CampusStoriesView').then(m => ({ default: m.CampusStoriesView })));
const CertificateVerifyView = lazy(() => import('./components/certificates/CertificateVerifyView').then(m => ({ default: m.CertificateVerifyView })));
const StudentDashboardView = lazy(() => import('./components/dashboard/StudentDashboardView').then(m => ({ default: m.StudentDashboardView })));
const MentorDashboardView = lazy(() => import('./components/dashboard/MentorDashboardView').then(m => ({ default: m.MentorDashboardView })));
const PhDScholarDashboardView = lazy(() => import('./components/dashboard/PhDScholarDashboardView').then(m => ({ default: m.PhDScholarDashboardView })));
const StudentPortfolioView = lazy(() => import('./components/dashboard/StudentPortfolioView').then(m => ({ default: m.StudentPortfolioView })));

// Modals & Overlays
import { AuthPortalModal } from './components/auth/AuthPortalModal';
import { StudentRegistrationModal } from './components/auth/StudentRegistrationModal';
import { MentorOnboardingModal } from './components/auth/MentorOnboardingModal';
import { VideoCallModal } from './components/workspace/VideoCallModal';
import { CampusAIAssistant } from './components/ai/CampusAIAssistant';
import { DirectMessagingModal } from './components/messaging/DirectMessagingModal';
import { UserProfileModal } from './components/network/UserProfileModal';

const RoleDashboardRouter: React.FC = () => {
  const { activeRole } = useApp();
  return (
    <>
      {activeRole === 'student' && <StudentDashboardView />}
      {activeRole === 'mentor' && <MentorDashboardView />}
      {activeRole === 'researcher' && <PhDScholarDashboardView />}
    </>
  );
};

const MainContent: React.FC = () => {
  const location = useLocation();
  const { setActiveTab } = useApp();

  // Keep activeTab in sync with current pathname
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const path = location.pathname.replace(/^\//, '').split('/')[0] || 'home';
    
    const validTabs = [
      'home', 'discover', 'projects', 'events', 'mentors', 
      'research', 'workspace', 'dashboard', 'portfolio', 
      'certificates', 'verify', 'ask', 'stories'
    ];
    
    if (path === 'verify') {
      setActiveTab('certificates');
    } else if (validTabs.includes(path)) {
      setActiveTab(path as any);
    }
  }, [location.pathname, setActiveTab]);

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Suspense fallback={<LoadingFallback message="Loading CampusNet Experience..." />}>
        <Routes>
          <Route path="/" element={<LandingPageView />} />
          <Route path="/discover" element={<DiscoverEcosystemView />} />
          
          <Route path="/projects" element={<ProjectsEcosystemView />} />
          <Route path="/projects/:id" element={<ProjectsEcosystemView />} />
          
          <Route path="/events" element={<EventsDirectoryView />} />
          <Route path="/events/:id" element={<EventsDirectoryView />} />
          
          <Route path="/mentors" element={<MentorDirectoryView />} />
          <Route path="/mentors/:id" element={<MentorDirectoryView />} />
          
          <Route path="/research" element={<ResearchHubView />} />
          
          <Route path="/workspace" element={<WorkspaceView />} />
          <Route path="/workspace/:teamId" element={<WorkspaceView />} />
          
          <Route path="/dashboard" element={<RoleDashboardRouter />} />
          <Route path="/portfolio" element={<StudentPortfolioView />} />
          
          <Route path="/certificates" element={<CertificateVerifyView />} />
          <Route path="/certificates/:certId" element={<CertificateVerifyView />} />
          <Route path="/verify" element={<CertificateVerifyView />} />
          <Route path="/verify/:certId" element={<CertificateVerifyView />} />
          
          <Route path="/ask" element={<AskCampusView />} />
          <Route path="/stories" element={<CampusStoriesView />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

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
