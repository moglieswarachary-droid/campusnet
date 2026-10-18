import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck, Award, Users, Calendar, Video,
  Bell, Settings, LogOut, Globe, Sparkles, User,
  ChevronDown, BookOpen, CheckCircle2, MessageSquare,
  Clock, Check, X, FolderKanban, Search, Menu,
  UserCheck, TrendingUp, ChevronRight
} from 'lucide-react';

import { MentorAuthView } from './MentorAuthView';
import { MentorDashboardView } from '../../dashboard/MentorDashboardView';
import { MentorSidebar } from './MentorSidebar';
import { MentorCommandPalette } from './MentorCommandPalette';
import { MentorRequestsView } from './MentorRequestsView';
import { MentorStudentsView } from './MentorStudentsView';
import { MentorTeamsView } from './MentorTeamsView';
import { MentorProjectsView } from './MentorProjectsView';
import { MentorReviewsView } from './MentorReviewsView';
import { MentorSessionsView } from './MentorSessionsView';
import { MentorMessagesView } from './MentorMessagesView';
import { MentorCertificatesView } from './MentorCertificatesView';
import { MentorAnalyticsView } from './MentorAnalyticsView';
import { MentorProfileView } from './MentorProfileView';
import { MentorNotificationsView } from './MentorNotificationsView';
import { MentorSettingsView } from './MentorSettingsView';

import { WorkspaceSwitcher } from '../../common/WorkspaceSwitcher';
import { LetterAvatar } from '../../common/LetterAvatar';
import { ToastContainer } from '../../common/Toast';
import { MentorProfileEditModal } from '../../dashboard/MentorProfileEditModal';
import { VideoCallModal } from '../../workspace/VideoCallModal';
import { CampusAIAssistant } from '../../ai/CampusAIAssistant';

// Slim Top Header
const MentorTopHeader: React.FC<{
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenEditProfile: () => void;
}> = ({ onOpenMobileSidebar, onOpenCommandPalette, onOpenEditProfile }) => {
  const location = useLocation();
  const { currentUser, mentors, mentorshipRequests, notifications, setIsAIModalOpen, logoutPortalSession } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const currentMentor = mentors.find(m =>
    (currentUser?.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (currentUser?.id && m.id === currentUser.id)
  ) || {
    id: currentUser?.id || 'mnt-current',
    name: currentUser?.name || 'Faculty Mentor',
    email: currentUser?.email || '',
    designation: 'Faculty Mentor',
    department: currentUser?.department || 'Engineering',
    institution: currentUser?.institution || 'Academic Network',
    avatar: currentUser?.avatar || ''
  };

  const pendingRequestsCount = mentorshipRequests.filter(r =>
    r.status === 'pending' && (r.mentorId === currentMentor.id || (currentMentor.email && (r as any).mentorEmail?.toLowerCase() === currentMentor.email.toLowerCase()))
  ).length;

  // Breadcrumb mapping
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('requests')) return { group: 'Mentoring', title: 'Student Requests' };
    if (path.includes('students')) return { group: 'Mentoring', title: 'My Mentees' };
    if (path.includes('teams')) return { group: 'Mentoring', title: 'Guided Teams' };
    if (path.includes('projects')) return { group: 'Mentoring', title: 'Projects' };
    if (path.includes('reviews')) return { group: 'Mentoring', title: 'Milestone Reviews' };
    if (path.includes('sessions')) return { group: 'Mentoring', title: 'Sessions & Calendar' };
    if (path.includes('messages')) return { group: 'Mentoring', title: 'Messages' };
    if (path.includes('certificates')) return { group: 'Management', title: 'Certificates' };
    if (path.includes('analytics')) return { group: 'Management', title: 'Mentoring Analytics' };
    if (path.includes('profile')) return { group: 'Management', title: 'Faculty Profile' };
    if (path.includes('notifications')) return { group: 'Management', title: 'Notifications' };
    if (path.includes('settings')) return { group: 'Management', title: 'Settings' };
    return { group: 'Overview', title: 'Mentor Command Center' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Left: Mobile hamburger & Logo & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            <Link to="/mentor/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#12243A] flex items-center justify-center text-white shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-[#12243A]">
                    CampusNet<span className="text-[#0F9488]">+</span>
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-teal-50 text-[#0F9488] border border-teal-200/60">
                    Faculty
                  </span>
                </div>
              </div>
            </Link>

            {/* Breadcrumb separator */}
            <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">{breadcrumb.group}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-[#12243A]">{breadcrumb.title}</span>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#F3F6FA] hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-500 transition-all group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F9488] transition-colors" />
                <span className="truncate">Search mentees, teams, reviews, or actions...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded shadow-2xs">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Search Icon */}
            <button
              onClick={onOpenCommandPalette}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-[#0F9488] hover:bg-teal-100 border border-teal-200/70 transition-colors shadow-2xs"
              title="Launch AI Faculty Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F3A640]" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications Pill */}
            <Link
              to="/mentor/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Faculty Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F3A640] ring-2 ring-white" />
              )}
            </Link>

            {/* Multi-Role Workspace Switcher */}
            <WorkspaceSwitcher />

            {/* Public Directory Link */}
            <Link
              to="/landing"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F9488] px-2.5 py-1.5 rounded-xl hover:bg-slate-50"
              title="Explore shared campus directory"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Directory</span>
            </Link>

            {/* Mentor Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <LetterAvatar
                  name={currentMentor?.name || currentUser?.name || 'Mentor'}
                  size="xs"
                  className="w-7 h-7 rounded-lg ring-1 ring-slate-200"
                />
                <span className="text-xs font-bold text-[#12243A] max-w-[100px] truncate hidden sm:inline">
                  {currentMentor?.name || currentUser?.name || 'Mentor'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-2xl shadow-xl bg-white border border-slate-100 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3">
                    <p className="text-xs font-bold text-[#12243A] truncate">{currentMentor?.name || currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentMentor?.email || currentUser?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-[#0F9488] border border-teal-200/60">
                      {currentMentor?.institution || currentUser?.institution || 'IIT Bombay'}
                    </span>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Faculty Profile</span>
                    </button>
                    <Link
                      to="/mentor/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>Public Mentor View</span>
                    </Link>
                    <Link
                      to="/mentor/certificates"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Issued Certificates</span>
                    </Link>
                    <Link
                      to="/mentor/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Capacity & Domain Settings</span>
                    </Link>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => logoutPortalSession('mentor')}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Mentor Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

// Main Mentor Portal App Component
export const MentorPortalApp: React.FC = () => {
  const location = useLocation();
  const { currentUser, mentors } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const currentMentor = mentors.find(m =>
    (currentUser?.email && m.email === currentUser.email) ||
    (currentUser?.name && m.name === currentUser.name)
  ) || mentors[0];

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth routes
  const isAuthRoute =
    location.pathname === '/mentor/login' ||
    location.pathname === '/mentor/register' ||
    location.pathname === '/mentor/forgot-password';

  if (isAuthRoute) {
    const mode = location.pathname.includes('register')
      ? 'register'
      : location.pathname.includes('forgot-password')
        ? 'forgot-password'
        : 'login';
    return <MentorAuthView mode={mode} />;
  }

  // Bare /mentor redirect to /mentor/dashboard
  if (location.pathname === '/mentor' || location.pathname === '/mentor/') {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  // Guard: If not authenticated, redirect to login preserving target
  const hasToken = Boolean(sessionStorage.getItem('campusnet_token') || localStorage.getItem('campusnet_token'));
  const hasGenuineUser = Boolean(currentUser && currentUser.email && !currentUser.email.includes('aarav.sharma@nitk.edu.in'));
  const isAuthenticated = hasToken || hasGenuineUser;
  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/mentor/dashboard'
      ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
      : '';
    return <Navigate to={`/mentor/login${redirectParam}`} replace />;
  }

  return (
    <div className="min-h-screen bg-[#F3F6FA] text-slate-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <MentorTopHeader
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <MentorSidebar className="hidden lg:flex" />

        {/* Mobile Slide-Out Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#12243A] flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="font-black text-sm text-[#12243A]">CampusNet Mentor</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MentorSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-12">
          <Routes>
            <Route path="/mentor/dashboard" element={<MentorDashboardView />} />
            <Route path="/mentor/requests" element={<MentorRequestsView />} />
            <Route path="/mentor/students" element={<MentorStudentsView />} />
            <Route path="/mentor/teams" element={<MentorTeamsView />} />
            <Route path="/mentor/projects" element={<MentorProjectsView />} />
            <Route path="/mentor/reviews" element={<MentorReviewsView />} />
            <Route path="/mentor/sessions" element={<MentorSessionsView />} />
            <Route path="/mentor/messages" element={<MentorMessagesView />} />
            <Route path="/mentor/certificates" element={<MentorCertificatesView />} />
            <Route path="/mentor/analytics" element={<MentorAnalyticsView />} />
            <Route path="/mentor/profile" element={<MentorProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
            <Route path="/mentor/notifications" element={<MentorNotificationsView />} />
            <Route path="/mentor/settings" element={<MentorSettingsView />} />

            {/* Relative path fallbacks */}
            <Route path="dashboard" element={<MentorDashboardView />} />
            <Route path="requests" element={<MentorRequestsView />} />
            <Route path="students" element={<MentorStudentsView />} />
            <Route path="teams" element={<MentorTeamsView />} />
            <Route path="projects" element={<MentorProjectsView />} />
            <Route path="reviews" element={<MentorReviewsView />} />
            <Route path="sessions" element={<MentorSessionsView />} />
            <Route path="messages" element={<MentorMessagesView />} />
            <Route path="certificates" element={<MentorCertificatesView />} />
            <Route path="analytics" element={<MentorAnalyticsView />} />
            <Route path="profile" element={<MentorProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
            <Route path="notifications" element={<MentorNotificationsView />} />
            <Route path="settings" element={<MentorSettingsView />} />

            <Route path="*" element={<Navigate to="/mentor/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-30 shadow-lg px-2 py-1.5 flex items-center justify-around text-[10px] font-bold">
        <Link
          to="/mentor/dashboard"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/mentor/dashboard' ? 'text-[#0F9488]' : 'text-slate-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/mentor/requests"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/mentor/requests' ? 'text-[#0F9488]' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Requests</span>
        </Link>
        <Link
          to="/mentor/projects"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/mentor/projects' ? 'text-[#0F9488]' : 'text-slate-500'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Projects</span>
        </Link>
        <Link
          to="/mentor/reviews"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/mentor/reviews' ? 'text-[#0F9488]' : 'text-slate-500'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Reviews</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 rounded-xl text-slate-500 hover:text-slate-800"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Global Command Palette */}
      <MentorCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Edit Faculty Profile Modal */}
      {isEditProfileOpen && currentMentor && (
        <MentorProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          mentor={currentMentor}
        />
      )}

      {/* Global Workspace Overlays */}
      <VideoCallModal />
      <CampusAIAssistant />
      <ToastContainer />

    </div>
  );
};
