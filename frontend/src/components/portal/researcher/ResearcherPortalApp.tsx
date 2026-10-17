import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen, Sparkles, Award, Users, Calendar,
  Bell, Settings, LogOut, Globe, User, ChevronDown,
  Search, FileText, Share2, ArrowRight, CheckCircle2,
  Plus, ExternalLink, Compass, Menu, X, Atom,
  ChevronRight, Globe2, Building2, Coins, CheckSquare,
  MessageSquare, TrendingUp
} from 'lucide-react';

import { ResearcherAuthView } from './ResearcherAuthView';
import { ResearcherDashboardView } from './ResearcherDashboardView';
import { ResearcherSidebar } from './ResearcherSidebar';
import { ResearcherCommandPalette } from './ResearcherCommandPalette';
import { ResearcherPublicationsView } from './ResearcherPublicationsView';
import { ResearcherProjectsView } from './ResearcherProjectsView';
import { ResearcherCollaborationsView } from './ResearcherCollaborationsView';
import { ResearcherOpportunitiesView } from './ResearcherOpportunitiesView';
import { ResearcherDirectoryView } from './ResearcherDirectoryView';
import { ResearcherInstitutionsView } from './ResearcherInstitutionsView';
import { ResearcherFundingView } from './ResearcherFundingView';
import { ResearcherMilestonesView } from './ResearcherMilestonesView';
import { ResearcherMessagesView } from './ResearcherMessagesView';
import { ResearcherAnalyticsView } from './ResearcherAnalyticsView';
import { ResearcherProfileView } from './ResearcherProfileView';
import { ResearcherNotificationsView } from './ResearcherNotificationsView';
import { ResearcherSettingsView } from './ResearcherSettingsView';
import { LetterAvatar } from '../../common/LetterAvatar';

import { PhDScholarProfileEditModal } from '../../dashboard/PhDScholarProfileEditModal';
import { WorkspaceSwitcher } from '../../common/WorkspaceSwitcher';
import { ToastContainer } from '../../common/Toast';
import { VideoCallModal } from '../../workspace/VideoCallModal';
import { CampusAIAssistant } from '../../ai/CampusAIAssistant';

// Slim Top Header
const ResearcherTopHeader: React.FC<{
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenEditProfile: () => void;
}> = ({ onOpenMobileSidebar, onOpenCommandPalette, onOpenEditProfile }) => {
  const location = useLocation();
  const { currentUser, researchers, setIsAIModalOpen, logoutPortalSession } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const currentScholar = researchers.find(r =>
    (currentUser?.email && r.email === currentUser.email) ||
    (currentUser?.name && r.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || ''))
  ) || researchers[0];

  // Breadcrumb mapping
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('publications')) return { group: 'Research', title: 'Publications & Datasets' };
    if (path.includes('projects')) return { group: 'Research', title: 'Research Projects' };
    if (path.includes('collaborations')) return { group: 'Research', title: 'Collaborations' };
    if (path.includes('opportunities')) return { group: 'Research', title: 'Conferences & Calls' };
    if (path.includes('directory')) return { group: 'Discovery', title: 'Researcher Directory' };
    if (path.includes('institutions')) return { group: 'Discovery', title: 'Labs & Institutions' };
    if (path.includes('funding')) return { group: 'Discovery', title: 'Funding & Grants' };
    if (path.includes('milestones')) return { group: 'Management', title: 'Tasks & Milestones' };
    if (path.includes('messages')) return { group: 'Management', title: 'Messages' };
    if (path.includes('analytics')) return { group: 'Management', title: 'Research Analytics' };
    if (path.includes('profile')) return { group: 'Management', title: 'Scholarly Profile' };
    if (path.includes('notifications')) return { group: 'Management', title: 'Notifications' };
    if (path.includes('settings')) return { group: 'Management', title: 'Settings' };
    return { group: 'Research', title: 'Research Command Center' };
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

            <Link to="/researcher/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#182442] flex items-center justify-center text-white shadow-2xs">
                <Atom className="w-4 h-4 text-purple-400" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-[#182442]">
                    CampusNet<span className="text-[#6954C8]">+</span>
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-purple-50 text-[#6954C8] border border-purple-200/60">
                    Research Hub
                  </span>
                </div>
              </div>
            </Link>

            {/* Breadcrumb separator */}
            <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">{breadcrumb.group}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-[#182442]">{breadcrumb.title}</span>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#F4F6FA] hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-500 transition-all group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6954C8] transition-colors" />
                <span className="truncate">Search publications, grants, scholars, or actions...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded shadow-2xs">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right Header Controls */}
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
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-[#6954C8] hover:bg-purple-100 border border-purple-200/70 transition-colors shadow-2xs"
              title="Launch AI Research Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications Pill */}
            <Link
              to="/researcher/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Scholarly Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E9A23B] ring-2 ring-white" />
            </Link>

            {/* Multi-Role Workspace Switcher */}
            <WorkspaceSwitcher />

            {/* Public Directory Link */}
            <Link
              to="/landing"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#6954C8] px-2.5 py-1.5 rounded-xl hover:bg-slate-50"
              title="Explore shared campus directory"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Directory</span>
            </Link>

            {/* Scholar Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <LetterAvatar
                  name={currentScholar?.name || currentUser?.name || 'Scholar'}
                  size="xs"
                  className="w-7 h-7 rounded-lg ring-1 ring-slate-200"
                />
                <span className="text-xs font-bold text-[#182442] max-w-[100px] truncate hidden sm:inline">
                  {currentScholar?.name || currentUser?.name || 'Scholar'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-2xl shadow-xl bg-white border border-slate-100 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3">
                    <p className="text-xs font-bold text-[#182442] truncate">{currentScholar?.name || currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentScholar?.email || currentUser?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#6954C8] border border-purple-200/60">
                      {currentScholar?.university || currentScholar?.institution || 'IISc Bengaluru'}
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
                      <span>Edit Scholar Profile</span>
                    </button>
                    <Link
                      to="/researcher/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>Scholarly Profile</span>
                    </Link>
                    <Link
                      to="/researcher/publications"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Publications & Pre-Prints</span>
                    </Link>
                    <Link
                      to="/researcher/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>ORCID & Lab Preferences</span>
                    </Link>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => logoutPortalSession('scholar')}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Research Portal</span>
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

// Main Researcher Portal App
export const ResearcherPortalApp: React.FC = () => {
  const location = useLocation();
  const { currentUser, researchers } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const currentScholar = researchers.find(r =>
    (currentUser?.email && r.email === currentUser.email) ||
    (currentUser?.name && r.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || ''))
  ) || researchers[0];

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
    location.pathname === '/researcher/login' ||
    location.pathname === '/research/login' ||
    location.pathname === '/researcher/register' ||
    location.pathname === '/researcher/forgot-password';

  if (isAuthRoute) {
    const mode = location.pathname.includes('register')
      ? 'register'
      : location.pathname.includes('forgot-password')
        ? 'forgot-password'
        : 'login';
    return <ResearcherAuthView mode={mode} />;
  }

  // Bare /researcher redirect to /researcher/dashboard
  if (location.pathname === '/researcher' || location.pathname === '/researcher/') {
    return <Navigate to="/researcher/dashboard" replace />;
  }

  // Guard: If not authenticated, redirect to login preserving intended target
  const isAuthenticated = Boolean(currentUser && currentUser.id);
  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/researcher/dashboard'
      ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
      : '';
    return <Navigate to={`/researcher/login${redirectParam}`} replace />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <ResearcherTopHeader
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <ResearcherSidebar className="hidden lg:flex" />

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
                  <div className="w-8 h-8 rounded-xl bg-[#182442] flex items-center justify-center text-white">
                    <Atom className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-black text-sm text-[#182442]">CampusNet Research</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ResearcherSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-12">
          <Routes>
            <Route path="/researcher/dashboard" element={<ResearcherDashboardView />} />
            <Route path="/researcher/publications" element={<ResearcherPublicationsView />} />
            <Route path="/researcher/projects" element={<ResearcherProjectsView />} />
            <Route path="/researcher/collaborations" element={<ResearcherCollaborationsView />} />
            <Route path="/researcher/opportunities" element={<ResearcherOpportunitiesView />} />
            <Route path="/researcher/directory" element={<ResearcherDirectoryView />} />
            <Route path="/researcher/institutions" element={<ResearcherInstitutionsView />} />
            <Route path="/researcher/funding" element={<ResearcherFundingView />} />
            <Route path="/researcher/milestones" element={<ResearcherMilestonesView />} />
            <Route path="/researcher/messages" element={<ResearcherMessagesView />} />
            <Route path="/researcher/analytics" element={<ResearcherAnalyticsView />} />
            <Route path="/researcher/profile" element={<ResearcherProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
            <Route path="/researcher/notifications" element={<ResearcherNotificationsView />} />
            <Route path="/researcher/settings" element={<ResearcherSettingsView />} />

            {/* Relative path fallbacks */}
            <Route path="dashboard" element={<ResearcherDashboardView />} />
            <Route path="publications" element={<ResearcherPublicationsView />} />
            <Route path="projects" element={<ResearcherProjectsView />} />
            <Route path="collaborations" element={<ResearcherCollaborationsView />} />
            <Route path="opportunities" element={<ResearcherOpportunitiesView />} />
            <Route path="directory" element={<ResearcherDirectoryView />} />
            <Route path="institutions" element={<ResearcherInstitutionsView />} />
            <Route path="funding" element={<ResearcherFundingView />} />
            <Route path="milestones" element={<ResearcherMilestonesView />} />
            <Route path="messages" element={<ResearcherMessagesView />} />
            <Route path="analytics" element={<ResearcherAnalyticsView />} />
            <Route path="profile" element={<ResearcherProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
            <Route path="notifications" element={<ResearcherNotificationsView />} />
            <Route path="settings" element={<ResearcherSettingsView />} />

            <Route path="*" element={<Navigate to="/researcher/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-30 shadow-lg px-2 py-1.5 flex items-center justify-around text-[10px] font-bold">
        <Link
          to="/researcher/dashboard"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/researcher/dashboard' ? 'text-[#6954C8]' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Overview</span>
        </Link>
        <Link
          to="/researcher/publications"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/researcher/publications' ? 'text-[#6954C8]' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Papers</span>
        </Link>
        <Link
          to="/researcher/projects"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/researcher/projects' ? 'text-[#6954C8]' : 'text-slate-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Projects</span>
        </Link>
        <Link
          to="/researcher/collaborations"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl ${
            location.pathname === '/researcher/collaborations' ? 'text-[#6954C8]' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Collab</span>
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
      <ResearcherCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Edit Scholar Profile Modal */}
      {isEditProfileOpen && (
        <PhDScholarProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          scholar={currentScholar}
        />
      )}

      {/* Global Workspace Overlays */}
      <VideoCallModal />
      <CampusAIAssistant />
      <ToastContainer />

    </div>
  );
};
