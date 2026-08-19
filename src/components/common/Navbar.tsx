import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Search, Bell, ChevronDown, 
  HelpCircle, Video, Award, ShieldCheck, Check, 
  Layers, UserCheck, MessageSquareCode, MessageSquare, 
  Compass, FolderKanban, GraduationCap, Calendar, CalendarPlus 
} from 'lucide-react';
import { RoleType } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, setActiveTab, 
    currentUser, activeRole, switchRole, 
    notifications, setIsAIModalOpen, 
    setAuthModalType, searchQuery, setSearchQuery, 
    setIsDirectMessagingOpen, directMessages 
  } = useApp();

  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener for instant search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = directMessages.filter(m => !m.read && m.receiverId === currentUser.id).length;

  const roles: { role: RoleType; label: string; desc: string; icon: any }[] = [
    { role: 'student', label: 'Student Portal', desc: 'Aarav Sharma (NITK Surathkal)', icon: UserCheck },
    { role: 'mentor', label: 'Faculty Mentor Portal', desc: 'Dr. Arvind Rao (IIT Bombay)', icon: ShieldCheck },
    { role: 'researcher', label: 'PhD Scholar Portal', desc: 'Kavya Ramanathan (IISc Bangalore)', icon: Sparkles }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-campus-border shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-campus-deep-blue flex items-center justify-center text-white shadow-warm-md group-hover:scale-105 transition-transform">
                <div className="relative">
                  <Layers className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-campus-bright-red rounded-full ring-2 ring-white animate-pulse"></span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-campus-deep-blue">
                    Campus<span className="text-campus-red">Net+</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-campus-soft-blue text-campus-blue px-1.5 py-0.5 rounded border border-blue-200">
                    India
                  </span>
                </div>
                <p className="text-[10.5px] font-medium text-campus-muted-text hidden md:block leading-none mt-0.5">
                  National Student & Innovation Ecosystem
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'home'
                    ? 'text-campus-blue bg-campus-soft-blue'
                    : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors flex items-center gap-1 ${
                  activeTab === 'discover'
                    ? 'text-campus-blue bg-campus-soft-blue'
                    : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                }`}
              >
                <Compass className="w-4 h-4 text-campus-red" />
                Discover
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors flex items-center gap-1 ${
                  activeTab === 'projects'
                    ? 'text-campus-blue bg-campus-soft-blue'
                    : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-amber-500" />
                Projects
              </button>

              {/* Events Dropdown with Discover Events & Host Event */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsEventsOpen(!isEventsOpen);
                    setIsCommunityOpen(false);
                    setIsMoreOpen(false);
                  }}
                  className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'events'
                      ? 'text-campus-blue bg-campus-soft-blue'
                      : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-campus-red" />
                  Events
                  <span className="w-2 h-2 rounded-full bg-campus-bright-red pulse-live"></span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isEventsOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-warm-xl border border-campus-border py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsEventsOpen(false)}
                  >
                    <button
                      onClick={() => {
                        setActiveTab('events');
                        setIsEventsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-campus-warm-white flex items-center gap-3 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-campus-soft-blue flex items-center justify-center text-campus-blue group-hover/item:scale-105 transition-transform">
                        <Calendar className="w-4 h-4 text-campus-blue" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-slate-text flex items-center gap-1.5">
                          Discover Events
                          <span className="w-1.5 h-1.5 rounded-full bg-campus-bright-red pulse-live"></span>
                        </div>
                        <div className="text-[11px] text-campus-muted-text">Browse national hackathons & fests</div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-campus-border"></div>

                    <button
                      onClick={() => {
                        setIsEventsOpen(false);
                        const currentUrl = new URL(window.location.href);
                        currentUrl.searchParams.set('portal', 'organizer');
                        window.location.href = currentUrl.toString();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-red-50/70 flex items-center gap-3 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-campus-red group-hover/item:scale-105 transition-transform">
                        <CalendarPlus className="w-4 h-4 text-campus-red" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-red flex items-center gap-1.5">
                          Host Event
                          <span className="text-[9px] font-extrabold uppercase bg-red-100 text-campus-red px-1.5 py-0.5 rounded border border-red-200">
                            Organizer
                          </span>
                        </div>
                        <div className="text-[11px] text-campus-muted-text">Submit proposal & college proof</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('mentors')}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'mentors'
                    ? 'text-campus-blue bg-campus-soft-blue'
                    : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                }`}
              >
                Mentors
              </button>

              <button
                onClick={() => setActiveTab('research')}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'research'
                    ? 'text-campus-blue bg-campus-soft-blue'
                    : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                }`}
              >
                Research
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-campus-blue bg-campus-soft-blue'
                    : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                }`}
              >
                Dashboard
              </button>

              {/* Community Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCommunityOpen(!isCommunityOpen);
                    setIsMoreOpen(false);
                  }}
                  className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors flex items-center gap-1 ${
                    activeTab === 'ask' || activeTab === 'stories'
                      ? 'text-campus-blue bg-campus-soft-blue'
                      : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                  }`}
                >
                  Community
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCommunityOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCommunityOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-warm-xl border border-campus-border py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsCommunityOpen(false)}
                  >
                    <button
                      onClick={() => {
                        setActiveTab('ask');
                        setIsCommunityOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-campus-warm-white flex items-center gap-3 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-campus-soft-blue flex items-center justify-center text-campus-blue">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-slate-text">Ask Campus</div>
                        <div className="text-[11px] text-campus-muted-text">Academic problem solving</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('stories');
                        setIsCommunityOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-campus-warm-white flex items-center gap-3 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-campus-red">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-slate-text">Campus Stories</div>
                        <div className="text-[11px] text-campus-muted-text">Short project video demos</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsMoreOpen(!isMoreOpen);
                    setIsCommunityOpen(false);
                  }}
                  className={`px-3 py-2 text-xs xl:text-sm font-bold rounded-lg transition-colors flex items-center gap-1 ${
                    activeTab === 'workspace' || activeTab === 'portfolio' || activeTab === 'certificates'
                      ? 'text-campus-blue bg-campus-soft-blue'
                      : 'text-campus-slate-text hover:text-campus-blue hover:bg-campus-warm-white'
                  }`}
                >
                  More
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMoreOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-warm-xl border border-campus-border py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsMoreOpen(false)}
                  >
                    <button
                      onClick={() => {
                        setActiveTab('workspace');
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-campus-warm-white flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-campus-blue">
                        <MessageSquareCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-slate-text">Team Workspace</div>
                        <div className="text-[11px] text-campus-muted-text">Private 6-member studio</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('portfolio');
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-campus-warm-white flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-campus-amber">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-slate-text">Innovation Portfolio</div>
                        <div className="text-[11px] text-campus-muted-text">Verified student growth</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('certificates');
                        setIsMoreOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-campus-warm-white flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-campus-green">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-campus-slate-text">Verifiable Certificates</div>
                        <div className="text-[11px] text-campus-muted-text">QR code validation portal</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Campus AI Assistant Button */}
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-campus-deep-blue text-white text-xs sm:text-sm font-bold shadow-warm-md hover:bg-campus-blue transition-all group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Campus</span> AI
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-campus-bright-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-campus-bright-red"></span>
              </span>
            </button>

            {/* Direct Messaging Trigger */}
            <button
              onClick={() => setIsDirectMessagingOpen(true)}
              className="p-2 rounded-xl text-campus-slate-text hover:bg-campus-warm-white transition-colors relative"
              title="CampusNet Direct Messages"
            >
              <MessageSquare className="w-5 h-5 text-campus-muted-text" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-campus-bright-red rounded-full" />
              )}
            </button>

            {/* Universal Search Bar / Trigger */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 sm:w-80 bg-white rounded-xl shadow-warm-lg border border-campus-border p-1.5 flex items-center gap-2 z-50 animate-in fade-in">
                  <Search className="w-4 h-4 text-campus-muted-text ml-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects, mentors, skills..."
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-campus-slate-text"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs text-campus-muted-text hover:text-campus-slate-text px-2 py-1 rounded hover:bg-campus-warm-white"
                  >
                    Esc
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-xl text-campus-slate-text hover:bg-campus-warm-white transition-colors flex items-center gap-1.5"
                  title="Search platform (Ctrl+K / ⌘K)"
                >
                  <Search className="w-5 h-5 text-campus-muted-text" />
                  <span className="hidden xl:inline-flex text-[10px] font-bold text-campus-muted-text bg-campus-warm-white border border-campus-border px-1.5 py-0.5 rounded shadow-warm-xs">
                    Ctrl K
                  </span>
                </button>
              )}
            </div>

            {/* Notifications Center */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-campus-slate-text hover:bg-campus-warm-white transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-campus-muted-text" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-campus-bright-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-warm-xl border border-campus-border py-3 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsNotificationsOpen(false)}
                >
                  <div className="px-4 pb-2 border-b border-campus-border flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-campus-deep-blue">Notifications</h3>
                      <p className="text-xs text-campus-muted-text">{unreadCount} unread alerts</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="text-xs text-campus-blue font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto divide-y divide-campus-border/60">
                    {notifications.slice(0, 4).map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (n.linkAction) setActiveTab(n.linkAction as any);
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-3 text-left hover:bg-campus-warm-white transition-colors cursor-pointer ${
                          !n.read ? 'bg-campus-soft-blue/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-campus-slate-text">{n.title}</h4>
                          <span className="text-[10px] text-campus-muted-text whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-campus-muted-text mt-1 line-clamp-2">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-campus-border hover:bg-campus-warm-white transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-campus-border"
                />
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-campus-slate-text leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-campus-blue capitalize">
                    {activeRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-campus-muted-text" />
              </button>

              {isRoleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-warm-xl border border-campus-border p-3 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsRoleMenuOpen(false)}
                >
                  <div className="px-2 py-1.5 border-b border-campus-border mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-campus-muted-text">Active User</p>
                    <p className="text-sm font-bold text-campus-deep-blue truncate">{currentUser.name}</p>
                    <p className="text-xs text-campus-muted-text truncate">{currentUser.institution}</p>
                  </div>

                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-campus-muted-text px-2 my-1">
                    Simulate Network Role
                  </p>
                  
                  <div className="space-y-1">
                    {roles.map(r => {
                      const Icon = r.icon;
                      const isActive = activeRole === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => {
                            switchRole(r.role);
                            setIsRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isActive 
                              ? 'bg-campus-soft-blue text-campus-blue font-bold' 
                              : 'hover:bg-campus-warm-white text-campus-slate-text'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-campus-blue' : 'text-campus-muted-text'}`} />
                            <div>
                              <div className="font-semibold">{r.label}</div>
                              <div className="text-[10px] text-campus-muted-text font-normal">{r.desc}</div>
                            </div>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-campus-blue" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-campus-border mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setAuthModalType('student_register');
                        setIsRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-campus-blue font-semibold hover:bg-campus-soft-blue rounded-lg transition-colors"
                    >
                      + Student Registration
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalType('mentor_onboarding');
                        setIsRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-campus-red font-semibold hover:bg-red-50 rounded-lg transition-colors"
                    >
                      + Mentor Onboarding
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalType('scholar_register');
                        setIsRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-purple-700 font-semibold hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      + PhD Scholar Registration
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Auth Modal Trigger */}
            <button
              onClick={() => setAuthModalType('login')}
              className="hidden xl:inline-flex campus-btn-red text-xs px-3.5 py-2 font-bold shadow-warm-sm"
            >
              Sign In
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
