import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, LayoutDashboard, Calendar, Users, 
  QrCode, FileText, Award, Bell, BarChart3, 
  Settings, LogOut, ShieldCheck, Plus, CheckSquare, 
  Sparkles, ExternalLink, Menu, X, ChevronRight, Gavel 
} from 'lucide-react';

export type OrganizerTab = 
  | 'dashboard'
  | 'events'
  | 'create_event'
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

  const orgEvents = events.filter(e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName);
  const pendingSubmissions = projectSubmissions.filter(s => s.status === 'submitted');

  const menuItems: { id: OrganizerTab; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Management Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'College Events & Lifecycle', icon: Calendar, badge: orgEvents.length },
    { id: 'create_event', label: 'Create New Event', icon: Plus },
    { id: 'registrations', label: 'Participants & Teams', icon: Users, badge: eventRegistrations.length },
    { id: 'attendance', label: 'QR Attendance & Check-In', icon: QrCode },
    { id: 'submissions', label: 'Project Submissions', icon: FileText, badge: pendingSubmissions.length > 0 ? pendingSubmissions.length : undefined },
    { id: 'judges', label: 'Judging & Criteria Rubrics', icon: CheckSquare },
    { id: 'judge_portal', label: 'Jury Scoring View', icon: Gavel },
    { id: 'winners', label: 'Final Results & Rankings', icon: Award },
    { id: 'certificates', label: 'Certificate Management', icon: ShieldCheck },
    { id: 'announcements', label: 'Broadcast Announcements', icon: Bell },
    { id: 'reports', label: 'Analytics & Export Reports', icon: BarChart3 },
    { id: 'profile', label: 'Institution Profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white tracking-tight">
                  Campus<span className="text-amber-400">Net+</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  Organizer
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {currentOrganizer?.institutionName || 'Kuppam Engineering College'}
              </p>
            </div>
          </div>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
              <span>{currentOrganizer?.coordinatorName}</span>
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="text-[10.5px] text-slate-400 truncate">
              {currentOrganizer?.designation || 'Institutional Coordinator'}
            </div>
          </div>

          <button
            onClick={organizerLogout}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
            title="Log Out of Organizer Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 fixed lg:static inset-y-14 left-0 z-30 transform transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navigation Menu
            </div>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-slate-800 text-amber-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Institutional Accreditation Pill */}
          <div className="pt-4 border-t border-slate-800 mt-2 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-green-400 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified College
                </span>
                <span className="text-[9px] uppercase bg-green-950 px-1 rounded border border-green-800">AISHE Active</span>
              </div>
              <div className="text-slate-400 truncate">ID: {currentOrganizer?.id}</div>
              <div className="text-slate-500 text-[10px]">{currentOrganizer?.city}, {currentOrganizer?.state}</div>
            </div>

            <button
              onClick={organizerLogout}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-red-950/40 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
