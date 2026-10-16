import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { PortalRouter } from './components/portal/PortalRouter';
import { LoadingFallback } from './components/common/LoadingFallback';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { SuperAdminShortcutListener } from './components/common/SuperAdminShortcutListener';

import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

// Landing Sections (Critical Path)
import { LandingPageView } from './components/landing/LandingPageView';

// Dedicated RBAC Gateway & Independent Role Portals (Resilient Lazy Loading)
const RbacGatewayView = lazyWithRetry(() => import('./components/gateway/RbacGatewayView').then(m => ({ default: m.RbacGatewayView })));
const StudentPortalApp = lazyWithRetry(() => import('./components/portal/student/StudentPortalApp').then(m => ({ default: m.StudentPortalApp })));
const MentorPortalApp = lazyWithRetry(() => import('./components/portal/mentor/MentorPortalApp').then(m => ({ default: m.MentorPortalApp })));
const ResearcherPortalApp = lazyWithRetry(() => import('./components/portal/researcher/ResearcherPortalApp').then(m => ({ default: m.ResearcherPortalApp })));
const OrganizerApp = lazyWithRetry(() => import('./components/organizer/OrganizerApp').then(m => ({ default: m.OrganizerApp })));
const SuperAdminApp = lazyWithRetry(() => import('./components/admin/SuperAdminApp').then(m => ({ default: m.SuperAdminApp })));

// Public Hub Views
const DiscoverEcosystemView = lazyWithRetry(() => import('./components/discovery/DiscoverEcosystemView').then(m => ({ default: m.DiscoverEcosystemView })));
const ProjectsEcosystemView = lazyWithRetry(() => import('./components/projects/ProjectsEcosystemView').then(m => ({ default: m.ProjectsEcosystemView })));
const WorkspaceView = lazyWithRetry(() => import('./components/team/WorkspaceView').then(m => ({ default: m.WorkspaceView })));
const MentorDirectoryView = lazyWithRetry(() => import('./components/mentors/MentorDirectoryView').then(m => ({ default: m.MentorDirectoryView })));
const EventsDirectoryView = lazyWithRetry(() => import('./components/events/EventsDirectoryView').then(m => ({ default: m.EventsDirectoryView })));
const ResearchHubView = lazyWithRetry(() => import('./components/research/ResearchHubView').then(m => ({ default: m.ResearchHubView })));
const AskCampusView = lazyWithRetry(() => import('./components/community/AskCampusView').then(m => ({ default: m.AskCampusView })));
const CampusStoriesView = lazyWithRetry(() => import('./components/community/CampusStoriesView').then(m => ({ default: m.CampusStoriesView })));
const CertificateVerifyView = lazyWithRetry(() => import('./components/certificates/CertificateVerifyView').then(m => ({ default: m.CertificateVerifyView })));
const StudentDashboardView = lazyWithRetry(() => import('./components/dashboard/StudentDashboardView').then(m => ({ default: m.StudentDashboardView })));
const MentorDashboardView = lazyWithRetry(() => import('./components/dashboard/MentorDashboardView').then(m => ({ default: m.MentorDashboardView })));
const PhDScholarDashboardView = lazyWithRetry(() => import('./components/dashboard/PhDScholarDashboardView').then(m => ({ default: m.PhDScholarDashboardView })));
const StudentPortfolioView = lazyWithRetry(() => import('./components/dashboard/StudentPortfolioView').then(m => ({ default: m.StudentPortfolioView })));

// Modals & Overlays
const VideoCallModal = lazyWithRetry(() => import('./components/workspace/VideoCallModal').then(m => ({ default: m.VideoCallModal })));
const CampusAIAssistant = lazyWithRetry(() => import('./components/ai/CampusAIAssistant').then(m => ({ default: m.CampusAIAssistant })));
const DirectMessagingModal = lazyWithRetry(() => import('./components/messaging/DirectMessagingModal').then(m => ({ default: m.DirectMessagingModal })));
const UserProfileModal = lazyWithRetry(() => import('./components/network/UserProfileModal').then(m => ({ default: m.UserProfileModal })));

import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
    const path = location.pathname.replace(/^\//, '').split('/')[0] || 'landing';
    
    const validTabs = [
      'home', 'landing', 'discover', 'projects', 'events', 'mentors', 
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
      <ErrorBoundary fallbackMessage="The public ecosystem encountered a loading interruption. Please refresh to restore view.">
        <Suspense fallback={<LoadingFallback message="Loading CampusNet Ecosystem..." />}>
          <Routes>
            {/* Public Landing & Guest Exploration */}
            <Route path="/" element={<LandingPageView />} />
            <Route path="/landing" element={<LandingPageView />} />
            <Route path="/home" element={<LandingPageView />} />
            <Route path="/explore" element={<LandingPageView />} />
            
            {/* Direct legacy login redirect to RBAC Gateway */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            <Route path="/discover" element={<DiscoverEcosystemView />} />
            
            <Route path="/projects" element={<ProjectsEcosystemView />} />
            <Route path="/projects/:id" element={<ProjectsEcosystemView />} />
            
            <Route path="/events" element={<EventsDirectoryView />} />
            <Route path="/events/:id" element={<EventsDirectoryView />} />
            <Route path="/events/:id/register" element={<EventsDirectoryView />} />
            <Route path="/events/register" element={<EventsDirectoryView />} />
            
            <Route path="/mentors" element={<MentorDirectoryView />} />
            <Route path="/mentors/:id" element={<MentorDirectoryView />} />
            
            <Route path="/research" element={<ResearchHubView />} />
            
            {/* Protected Workspace & Collaboration Routes */}
            <Route 
              path="/workspace" 
              element={
                <ProtectedRoute requiredRoles={['STUDENT', 'MENTOR']}>
                  <WorkspaceView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workspace/:teamId" 
              element={
                <ProtectedRoute requiredRoles={['STUDENT', 'MENTOR']}>
                  <WorkspaceView />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy Protected Role Dashboards -> Namespaced Redirection */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRoles={['STUDENT', 'MENTOR', 'PHD_RESEARCHER']}>
                  <RoleDashboardRouter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute requiredRoles={['STUDENT']}>
                  <StudentPortfolioView />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/certificates" element={<CertificateVerifyView />} />
            <Route path="/certificates/:certId" element={<CertificateVerifyView />} />
            <Route path="/verify" element={<CertificateVerifyView />} />
            <Route path="/verify/:certId" element={<CertificateVerifyView />} />
            
            <Route path="/ask" element={<AskCampusView />} />
            <Route path="/stories" element={<CampusStoriesView />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

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
      <Suspense fallback={null}>
        <VideoCallModal />
        <CampusAIAssistant />
        <DirectMessagingModal />
        <UserProfileModal />
      </Suspense>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <SuperAdminShortcutListener />
      <PortalRouter
        gatewayApp={<RbacGatewayView />}
        studentApp={<StudentPortalApp />}
        mentorApp={<MentorPortalApp />}
        researcherApp={<ResearcherPortalApp />}
        organizerApp={<OrganizerApp />}
        adminApp={<SuperAdminApp />}
        publicApp={<PublicCampusNetApp />}
      />
    </AppProvider>
  );
}

export default App;
