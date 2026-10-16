import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Layers, ChevronDown, Sparkles, MessageSquare, Bell, Search,
  Menu, X, ShieldCheck, UserCheck, Lock, UserPlus, 
  Check, Compass, FolderKanban, Calendar, Users, 
  MessageSquareCode, HelpCircle, Video, Award, Building2, LayoutGrid, LogOut
} from 'lucide-react';
import { RoleType } from '../../types';
import { WorkspaceSelectionModal } from '../landing/WorkspaceSelectionModal';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const Navbar: React.FC = () => {
  const { 
    activeTab, setActiveTab, 
    currentUser, activeRole, switchRole, 
    notifications, setIsAIModalOpen, 
    openAuthModal, searchQuery, setSearchQuery, 
    setIsDirectMessagingOpen, directMessages 
  } = useApp();
  const navigate = useNavigate();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setIsRoleMenuOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = directMessages.filter(m => !m.read && m.receiverId === currentUser.id).length;

  const handleNav = (tab: any, path: string) => {
    setActiveTab(tab);
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
  };

  const roles: { role: RoleType; label: string; desc: string; icon: any }[] = [
    { role: 'student', label: 'Student Portal', desc: 'Aarav Sharma (NITK Surathkal)', icon: UserCheck },
    { role: 'mentor', label: 'Faculty Mentor Portal', desc: 'Dr. Arvind Rao (IIT Bombay)', icon: ShieldCheck },
    { role: 'researcher', label: 'PhD Scholar Portal', desc: 'Kavya Ramanathan (IISc Bangalore)', icon: Sparkles },
    { role: 'organizer', label: 'Institution Host Portal', desc: 'Dr. Anand Kumar (KEC Kuppam)', icon: Building2 }
  ];

  // Strictly: Home, Discover, Projects, Events, Mentors, Research
  const primaryNavItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'discover', label: 'Discover', path: '/discover' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'events', label: 'Events', path: '/events' },
    { id: 'mentors', label: 'Mentors', path: '/mentors' },
    { id: 'research', label: 'Research', path: '/research' },
  ];

  const secondaryNavItems = [
    { id: 'workspace', label: 'Team Workspace', sub: 'Private 6-member studio', path: '/workspace', icon: MessageSquareCode, color: 'text-indigo-600' },
    { id: 'ask', label: 'Ask Campus (Q&A)', sub: 'Academic problem solving', path: '/ask', icon: HelpCircle, color: 'text-blue-600' },
    { id: 'stories', label: 'Campus Stories', sub: 'Short project video demos', path: '/stories', icon: Video, color: 'text-rose-600' },
    { id: 'portfolio', label: 'Innovation Portfolio', sub: 'Verified student transcript', path: '/portfolio', icon: Award, color: 'text-amber-600' },
    { id: 'certificates', label: 'Verify Credentials', sub: 'QR tamper-proof lookup', path: '/certificates', icon: ShieldCheck, color: 'text-emerald-600' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: CampusNet+ Logo */}
            <button 
              type="button"
              onClick={() => handleNav('home', '/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer flex-shrink-0"
              aria-label="CampusNet Home"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  Campus<span className="text-indigo-600">Net+</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                  India
                </span>
              </div>
            </button>

            {/* Right: Primary Nav + More Dropdown + Auth Actions */}
            <div className="flex items-center gap-3 lg:gap-6">
              
              {/* Primary Navigation Links (Right-aligned, Desktop) */}
              <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
                {primaryNavItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNav(item.id, item.path)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

                {/* More Dropdown */}
                <div ref={moreDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMoreOpen(prev => !prev)}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                      secondaryNavItems.some(i => activeTab === i.id)
                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    aria-expanded={isMoreOpen}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMoreOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Additional Modules
                      </div>
                      
                      <div className="space-y-0.5">
                        {secondaryNavItems.map(item => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleNav(item.id, item.path)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                                isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center ${item.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-semibold leading-tight">{item.label}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{item.sub}</div>
                              </div>
                            </button>
                          );
                        })}

                        <div className="my-1 border-t border-slate-100" />

                        {/* Host Event / Organizer shortcut */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsMoreOpen(false);
                            window.location.href = '/organization/login';
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-50 text-rose-700 flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold leading-tight">Host an Event</div>
                            <div className="text-[10px] text-rose-500 font-normal">Organizer accreditation portal</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              {/* Vertical subtle divider */}
              <div className="hidden lg:block w-px h-5 bg-slate-200" />

              {/* Quick Actions & Profile Area */}
              <div className="flex items-center gap-2">
                
                {/* Direct Messages */}
                <button
                  type="button"
                  onClick={() => setIsDirectMessagingOpen(true)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                  title="Direct Messages"
                  aria-label="Direct Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                  )}
                </button>

                {/* Notifications Center */}
                <div ref={notifDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(prev => !prev)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                    title="Notifications"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-left animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-xs text-slate-900">Notifications</h3>
                        <button 
                          type="button"
                          onClick={() => {
                            setActiveTab('dashboard');
                            navigate('/dashboard');
                            setIsNotificationsOpen(false);
                          }}
                          className="text-[11px] text-indigo-600 hover:underline font-semibold"
                        >
                          View Dashboard
                        </button>
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.slice(0, 4).map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (n.linkAction) handleNav(n.linkAction as any, `/${n.linkAction}`);
                              setIsNotificationsOpen(false);
                            }}
                            className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !n.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-semibold text-slate-800">{n.title}</h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <button
                  type="button"
                  onClick={() => handleNav('dashboard', '/dashboard')}
                  className={`hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>

                {/* User Profile & Role Switcher */}
                <div ref={roleDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
                    aria-label="User Profile and Role Menu"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
                  </button>

                  {isRoleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-left animate-in fade-in slide-in-from-top-1">
                      <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Profile</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.institution}</p>
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 my-1">
                        Active Role Context
                      </p>
                      
                      <div className="space-y-1">
                        {roles.map(r => {
                          const Icon = r.icon;
                          const isActive = activeRole === r.role;
                          return (
                            <button
                              key={r.role}
                              type="button"
                              onClick={() => {
                                setIsRoleMenuOpen(false);
                                if (r.role === 'organizer') {
                                  window.location.href = '/organization/events';
                                } else {
                                  switchRole(r.role);
                                }
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                isActive 
                                  ? 'bg-indigo-50 text-indigo-700 font-bold' 
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <div>
                                  <div className="font-semibold leading-tight">{r.label}</div>
                                  <div className="text-[10px] text-slate-400 font-normal">{r.desc}</div>
                                </div>
                              </div>
                              {isActive && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>Choose Your Workspace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Switch Account / RBAC Gateway
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRoleMenuOpen(false);
                            sessionStorage.removeItem('campusnet_session_entered');
                            navigate('/');
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span>Sign Out</span>
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Multi-role Workspace Switcher */}
                <WorkspaceSwitcher />

                {/* Sign In & Join CampusNet buttons */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hidden xl:inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Join CampusNet
                </button>

                {/* Mobile Menu Hamburger */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(prev => !prev)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Toggle Navigation Menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                Main Navigation
              </p>
              {primaryNavItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id, item.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                More Tools & Portals
              </p>
              {secondaryNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id, item.path)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsWorkspaceModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Choose Your Workspace</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('student', 'login');
                  }}
                  className="py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNav('dashboard', '/dashboard');
                  }}
                  className="py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Workspace Selection Modal */}
      <WorkspaceSelectionModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />
    </>
  );
};
