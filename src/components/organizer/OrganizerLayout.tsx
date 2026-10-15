import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, LayoutDashboard, Calendar, Users, 
  QrCode, FileText, Award, Bell, BarChart3, 
  Settings, LogOut, ShieldCheck, Plus, CheckSquare, 
  Sparkles, ExternalLink, Menu, X, ChevronRight, Gavel,
  CheckCircle2, ArrowRight
} from 'lucide-react';

export type OrganizerTab = 
  | 'dashboard'
  | 'events'
  | 'create_event'
  | 'verify'
  | 'registrations'
  | 'attendance'
  | 'submissions'
  | 'judges'
  | 'judge_portal'
  | 'winners'
  | 'certificates'
  | 'announcements'
  | 'reports'
  | 'profile';

interface Props {
  activeSection: OrganizerTab;
  setActiveSection: (section: OrganizerTab) => void;
  children: React.ReactNode;
}

export const OrganizerLayout: React.FC<Props> = ({ activeSection, setActiveSection, children }) => {
  const { currentOrganizer, organizerLogout, events, eventRegistrations, projectSubmissions } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live data strictly connected to this specific organizer
  const orgEvents = events.filter(e => 
    e.organizerId === currentOrganizer?.id || 
    e.organizerId === currentOrganizer?.institutionId ||
    (currentOrganizer?.institutionName && e.organizer && e.organizer.toLowerCase().includes(currentOrganizer.institutionName.toLowerCase()))
  );
  
  const orgEventIds = new Set(orgEvents.map(e => e.id));
  const orgRegistrations = eventRegistrations.filter(r => orgEventIds.has(r.eventId));
  const pendingSubmissions = projectSubmissions.filter(s => orgEventIds.has(s.eventId) && s.status === 'submitted');

  interface NavigationGroup {
    title: string;
    items: {
      id: OrganizerTab;
      label: string;
      icon: any;
      badge?: number | string;
      highlight?: boolean;
    }[];
  }

  const navigationGroups: NavigationGroup[] = [
    {
      title: 'Core Workspace',
      items: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
        { id: 'events', label: 'Events & Hackathons', icon: Calendar, badge: orgEvents.length },
        { id: 'create_event', label: 'Host New Event', icon: Plus, highlight: true }
      ]
    },
    {
      title: 'Operations & Attendees',
      items: [
        { id: 'registrations', label: 'Student Registrations', icon: Users, badge: orgRegistrations.length },
        { id: 'attendance', label: 'QR Attendance Scanner', icon: QrCode },
        { id: 'submissions', label: 'Project Submissions', icon: FileText, badge: pendingSubmissions.length > 0 ? pendingSubmissions.length : undefined }
      ]
    },
    {
      title: 'Judging & Awards',
      items: [
        { id: 'judges', label: 'Rubrics & Evaluation', icon: CheckSquare },
        { id: 'winners', label: 'Results & Rankings', icon: Award },
        { id: 'certificates', label: 'Digital Certificates', icon: ShieldCheck }
      ]
    },
    {
      title: 'College Profile',
      items: [
        { 
          id: 'verify', 
          label: 'Institutional Verification', 
          icon: ShieldCheck, 
          badge: currentOrganizer?.verificationStatus === 'verified' ? 'Verified' : 'Under Review' 
        },
        { id: 'profile', label: 'College Profile & AISHE', icon: Building2 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar — Executive Frosted Glass Theme */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between shadow-warm-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-warm-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Campus<span className="text-amber-600">Net+</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                  ORGANIZER CONSOLE
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 truncate max-w-[200px] sm:max-w-md flex items-center gap-1">
                <span>{currentOrganizer?.institutionName || 'Academic Institution'}</span>
                {currentOrganizer?.verificationStatus === 'verified' && (
                  <span title="Verified by Super Admin">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Quick Primary Host Action + Profile */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => setActiveSection('create_event')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-warm-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Host New Event</span>
          </button>

          <div className="hidden sm:block text-right border-l border-slate-200 pl-3">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1.5">
              <span>{currentOrganizer?.coordinatorName}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Coordinator Session" />
            </div>
            <div className="text-[10.5px] text-slate-500 truncate max-w-[180px]">
              {currentOrganizer?.designation || 'Event Coordinator'}
            </div>
          </div>

          <button
            onClick={organizerLogout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
            title="Log Out of Organizer Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar — Grouped & Clean Light Theme */}
        <aside className={`w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/90 flex flex-col justify-between p-4 fixed lg:static inset-y-14 left-0 z-30 transform transition-transform duration-200 shadow-sm ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          
          <div className="space-y-4 overflow-y-auto pr-1">
            
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </div>

                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white font-bold shadow-warm-xs'
                            : item.highlight
                            ? 'bg-amber-50/80 text-amber-950 font-bold border border-amber-200 hover:bg-amber-100/80'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${
                            isActive ? 'text-amber-400' : item.highlight ? 'text-amber-700' : 'text-slate-400'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-amber-400 text-slate-950'
                              : typeof item.badge === 'string' && item.badge === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Status Badge & College Summary */}
          <div className="pt-3 border-t border-slate-200 mt-2 space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {currentOrganizer?.verificationStatus === 'verified' ? 'Verified College' : 'Under Review'}
                </span>
                <span className="text-[9px] uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">AISHE</span>
              </div>
              <div className="text-slate-700 font-mono text-[10px]">ID: {currentOrganizer?.id}</div>
              <div className="text-slate-500 text-[10px] truncate">{currentOrganizer?.city}, {currentOrganizer?.state}</div>
            </div>

            <button
              onClick={organizerLogout}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Console</span>
            </button>
          </div>

        </aside>

        {/* Right Main Content Area — Light Executive Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/60">
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
