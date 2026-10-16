import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  GraduationCap, FolderKanban, Users, Calendar, Award,
  Bell, Settings, LogOut, Globe, Sparkles, User, ExternalLink,
  ChevronDown, Search, CheckCircle2, Shield, ShieldCheck,
  Menu, X, BookOpen, Megaphone, Compass, QrCode, MessageSquare,
  Sparkle
} from 'lucide-react';

import { StudentAuthView } from './StudentAuthView';
import { StudentDashboardView } from '../../dashboard/StudentDashboardView';
import { StudentPortfolioView } from '../../dashboard/StudentPortfolioView';
import { ProjectsEcosystemView } from '../../projects/ProjectsEcosystemView';
import { WorkspaceView } from '../../team/WorkspaceView';
import { EventsDirectoryView } from '../../events/EventsDirectoryView';
import { WorkspaceSwitcher } from '../../common/WorkspaceSwitcher';
import { ToastContainer } from '../../common/Toast';
import { StudentProfileEditModal } from '../../dashboard/StudentProfileEditModal';

// New Student Portal views
import { StudentSidebar } from './StudentSidebar';
import { StudentCommandPalette } from './StudentCommandPalette';
import { StudentAcademicsView } from './StudentAcademicsView';
import { StudentAnnouncementsView } from './StudentAnnouncementsView';
import { StudentMentorshipView } from './StudentMentorshipView';
import { StudentOpportunitiesView } from './StudentOpportunitiesView';
import { StudentSkillsView } from './StudentSkillsView';
import { StudentCertificatesView } from './StudentCertificatesView';
import { StudentMessagesView } from './StudentMessagesView';

// Interactive Overlays
import { CampusAIAssistant } from '../../ai/CampusAIAssistant';
import { VideoCallModal } from '../../workspace/VideoCallModal';
import { DirectMessagingModal } from '../../messaging/DirectMessagingModal';
import { UserProfileModal } from '../../network/UserProfileModal';

// Dedicated Student Portal Top Header
const StudentTopHeader: React.FC<{
  onOpenEditProfile: () => void;
  onOpenCommandPalette: () => void;
  onToggleMobileDrawer: () => void;
}> = ({ onOpenEditProfile, onOpenCommandPalette, onToggleMobileDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, notifications, logoutPortalSession, setIsAIModalOpen } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logoutPortalSession('student');
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Drawer Trigger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileDrawer}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/student/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-campus-blue flex items-center justify-center text-white shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black tracking-tight text-campus-deep-blue">
                  CampusNet<span className="text-campus-red">+</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-campus-blue border border-blue-200/80">
                  Student Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Command Palette Trigger Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-400 transition-all shadow-2xs group"
            >
              <span className="flex items-center gap-2 text-slate-500 group-hover:text-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search routes, projects, events, or mentors...</span>
              </span>
              <kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Search Icon */}
            <button
              onClick={onOpenCommandPalette}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100/80 border border-indigo-200/80 transition-colors shadow-2xs"
              title="Launch AI Student Copilot"
            >
              <Sparkle className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Notifications Pill */}
            <Link
              to="/student/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Student Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-campus-red ring-2 ring-white" />
              )}
            </Link>

            {/* Multi-Role Workspace Switcher */}
            <WorkspaceSwitcher />

            {/* Public Directory Link */}
            <Link
              to="/landing"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-campus-blue px-2.5 py-1.5 rounded-xl hover:bg-slate-50"
              title="Explore shared campus directory"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Directory</span>
            </Link>

            {/* Student Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser?.name || 'Student'}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {currentUser?.name || 'Student'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white border border-slate-100 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      Roll No: {(currentUser as any)?.rollNumber || currentUser?.studentId || '22CS1048'}
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
                      <span>Edit Student Profile</span>
                    </button>
                    <Link
                      to="/student/portfolio"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Digital Portfolio & Certs</span>
                    </Link>
                    <Link
                      to="/student/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Student Portal</span>
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

// Student Mobile Bottom Navigation
const StudentMobileBottomNav: React.FC<{ onOpenMore: () => void }> = ({ onOpenMore }) => {
  const location = useLocation();

  const mobileNavItems = [
    { label: 'Overview', path: '/student/dashboard', icon: GraduationCap },
    { label: 'Academics', path: '/student/academics', icon: BookOpen },
    { label: 'Projects', path: '/student/projects', icon: FolderKanban },
    { label: 'Events', path: '/student/events', icon: Calendar },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1 flex items-center justify-around shadow-lg">
      {mobileNavItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path ||
          (item.path === '/student/dashboard' && (location.pathname === '/student' || location.pathname === '/student/'));

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] font-bold transition-colors ${
              isActive ? 'text-campus-blue' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-900"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};

// Student Notifications Sub-View
const StudentNotificationsView: React.FC = () => {
  const { notifications } = useApp();
  const [filterType, setFilterType] = useState('All');

  const filtered = notifications.filter(n => {
    if (filterType === 'All') return true;
    return (n as any).category === filterType || (n as any).type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-campus-deep-blue">Student Notifications & Mentorship Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated with your hackathons, team invitations, and mentor responses.</p>
        </div>
        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
          {notifications.length} Unread
        </span>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-start gap-3.5 hover:border-blue-200 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-campus-blue flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{n.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
            No unread notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};

// Student Settings Sub-View
const StudentSettingsView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [publicPortfolio, setPublicPortfolio] = useState(true);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-black text-campus-deep-blue">Student Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage privacy, hackathon alerts, and verifiable academic portfolio visibility.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Privacy & Discoverability</h3>
          
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-800">Public Academic Portfolio</p>
              <p className="text-[11px] text-slate-500">Allow external recruiters and verified mentors to view your achievements</p>
            </div>
            <input
              type="checkbox"
              checked={publicPortfolio}
              onChange={(e) => {
                setPublicPortfolio(e.target.checked);
                addToast({ type: 'info', message: 'Portfolio privacy preference updated.' });
              }}
              className="w-4 h-4 text-campus-blue rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-800">Email & SMS Event Notifications</p>
              <p className="text-[11px] text-slate-500">Receive schedule changes, judging calls, and round submissions alerts</p>
            </div>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => {
                setNotifyEmail(e.target.checked);
                addToast({ type: 'info', message: 'Notification preferences updated.' });
              }}
              className="w-4 h-4 text-campus-blue rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400">
          Institution: <strong>{currentUser?.institution || 'Academic Institution'}</strong> • Department: <strong>{currentUser?.department || 'Department'}</strong>
        </div>
      </div>
    </div>
  );
};

// Dedicated Student Profile View (Route: /student/profile)
const StudentProfileView: React.FC<{ onOpenEdit: () => void }> = ({ onOpenEdit }) => {
  const { currentUser } = useApp();
  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="h-36 bg-gradient-to-r from-campus-blue via-blue-700 to-indigo-900 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/30">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Verified Student Identity</span>
          </div>
        </div>
        
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
            />
            <div className="mb-1">
              <h2 className="text-xl font-black text-campus-deep-blue">{currentUser.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser.department} • {currentUser.institution}
              </p>
              <span className="inline-block mt-1 text-[10px] font-mono font-bold text-campus-blue bg-blue-50 px-2 py-0.5 rounded-md">
                Roll No: {(currentUser as any).rollNumber || currentUser.studentId || '22CS1048'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenEdit}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs self-end sm:self-auto"
          >
            <User className="w-3.5 h-3.5 text-campus-blue" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Bio & Research Interests</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentUser.bio || 'AI/ML undergraduate researching edge computer vision for precision agriculture & autonomous micro-drones. National Finalist at Smart India Hackathon.'}
          </p>

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pt-2">Technical Skills & Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {(currentUser.skills || ['PyTorch', 'ROS 2', 'React', 'FastAPI', 'Computer Vision']).map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {s}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-4">
            <Link to="/student/portfolio" className="text-xs font-bold text-campus-blue hover:underline">
              View Verifiable Portfolio →
            </Link>
            <Link to="/student/projects" className="text-xs font-bold text-campus-blue hover:underline">
              View Active Projects →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Student Portal App with Nested Routes & Sidebar Architecture
export const StudentPortalApp: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unauthenticated routes: login, register, forgot-password
  const isAuthRoute =
    location.pathname === '/student/login' ||
    location.pathname === '/student/register' ||
    location.pathname === '/student/forgot-password';

  if (isAuthRoute) {
    const mode = location.pathname.includes('register')
      ? 'register'
      : location.pathname.includes('forgot-password')
        ? 'forgot-password'
        : 'login';
    return <StudentAuthView mode={mode} />;
  }

  // If user navigated to bare /student or /student/ redirect to dashboard
  if (location.pathname === '/student' || location.pathname === '/student/') {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Guard: If not authenticated, redirect to login preserving intended target
  const isAuthenticated = Boolean(currentUser && currentUser.id);
  if (!isAuthenticated) {
    const redirectParam = location.pathname !== '/student/dashboard'
      ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
      : '';
    return <Navigate to={`/student/login${redirectParam}`} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <StudentTopHeader
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(prev => !prev)}
      />

      {/* Main Workspace: Left Sidebar + Content Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar (Persistent) */}
        <StudentSidebar className="hidden lg:flex" />

        {/* Mobile Slide-Over Drawer */}
        {isMobileDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex animate-in fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            <div
              className="w-72 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-black text-campus-deep-blue">
                  Student Navigation
                </span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <StudentSidebar
                onCloseMobile={() => setIsMobileDrawerOpen(false)}
                className="w-full flex-1 border-r-0"
              />
            </div>
          </div>
        )}

        {/* Scrollable Center Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-12">
          <Routes>
            {/* Required Canonical Routes */}
            <Route path="/student/dashboard" element={<StudentDashboardView />} />
            <Route path="/student/profile" element={<StudentProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
            <Route path="/student/academics" element={<StudentAcademicsView />} />
            <Route path="/student/announcements" element={<StudentAnnouncementsView />} />
            <Route path="/student/projects" element={<ProjectsEcosystemView />} />
            <Route path="/student/teams" element={<WorkspaceView />} />
            <Route path="/student/mentorship" element={<StudentMentorshipView />} />
            <Route path="/student/events" element={<EventsDirectoryView />} />
            <Route path="/student/opportunities" element={<StudentOpportunitiesView />} />
            <Route path="/student/portfolio" element={<StudentPortfolioView />} />
            <Route path="/student/skills" element={<StudentSkillsView />} />
            <Route path="/student/certificates" element={<StudentCertificatesView />} />
            <Route path="/student/messages" element={<StudentMessagesView />} />
            <Route path="/student/notifications" element={<StudentNotificationsView />} />
            <Route path="/student/settings" element={<StudentSettingsView />} />

            {/* Relative path fallbacks */}
            <Route path="dashboard" element={<StudentDashboardView />} />
            <Route path="profile" element={<StudentProfileView onOpenEdit={() => setIsEditProfileOpen(true)} />} />
            <Route path="academics" element={<StudentAcademicsView />} />
            <Route path="announcements" element={<StudentAnnouncementsView />} />
            <Route path="projects" element={<ProjectsEcosystemView />} />
            <Route path="teams" element={<WorkspaceView />} />
            <Route path="mentorship" element={<StudentMentorshipView />} />
            <Route path="events" element={<EventsDirectoryView />} />
            <Route path="opportunities" element={<StudentOpportunitiesView />} />
            <Route path="portfolio" element={<StudentPortfolioView />} />
            <Route path="skills" element={<StudentSkillsView />} />
            <Route path="certificates" element={<StudentCertificatesView />} />
            <Route path="messages" element={<StudentMessagesView />} />
            <Route path="notifications" element={<StudentNotificationsView />} />
            <Route path="settings" element={<StudentSettingsView />} />

            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <StudentMobileBottomNav onOpenMore={() => setIsMobileDrawerOpen(true)} />

      {/* Command Palette Overlay */}
      <StudentCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Edit Student Profile Modal */}
      {isEditProfileOpen && (
        <StudentProfileEditModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* Global Interactive Overlays */}
      <VideoCallModal />
      <CampusAIAssistant />
      <DirectMessagingModal />
      <UserProfileModal />

      <ToastContainer />
    </div>
  );
};
