import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, LayoutDashboard, CheckSquare, Users, 
  Building2, Award, BarChart3, ShieldCheck, 
  FileText, LogOut, Menu, X 
} from 'lucide-react';

export type SuperAdminTab = 
  | 'dashboard'
  | 'events_moderation'
  | 'institutions'
  | 'users'
  | 'certificates_audit'
  | 'analytics'
  | 'audit_logs';

interface Props {
  activeSection: SuperAdminTab;
  setActiveSection: (section: SuperAdminTab) => void;
  children: React.ReactNode;
}

export const SuperAdminLayout: React.FC<Props> = ({ activeSection, setActiveSection, children }) => {
  const { currentSuperAdmin, superAdminLogout, events } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingReviewEvents = events.filter(e => e.status === 'review');

  const menuItems: { id: SuperAdminTab; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Ecosystem Overview', icon: LayoutDashboard },
    { id: 'events_moderation', label: 'Event Approval Queue', icon: CheckSquare, badge: pendingReviewEvents.length > 0 ? pendingReviewEvents.length : undefined },
    { id: 'institutions', label: 'Colleges & Institutions', icon: Building2 },
    { id: 'users', label: 'National User Moderation', icon: Users },
    { id: 'certificates_audit', label: 'Certificate Registry Audit', icon: Award },
    { id: 'analytics', label: 'National Analytics', icon: BarChart3 },
    { id: 'audit_logs', label: 'Immutable Security Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-red-950/40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold shadow-lg shadow-red-950/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white tracking-tight">
                  Campus<span className="text-red-500">Net</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded">
                  Super Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400">National Innovation Governance & Oversight Console</p>
            </div>
          </div>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
              <span>{currentSuperAdmin?.name || 'Chief Administrator'}</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="text-[10.5px] text-slate-400">Master Level-5 Authority</div>
          </div>

          <button
            onClick={superAdminLogout}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
            title="Lock Super Admin Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className={`w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between p-4 fixed lg:static inset-y-14 left-0 z-30 transform transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              National Governance
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
                      ? 'bg-red-600 text-white font-black shadow-lg shadow-red-950/50'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black text-white' : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Security Banner */}
          <div className="pt-4 border-t border-slate-900 mt-2 space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-red-400 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MFA Protected
                </span>
                <span className="text-[9px] uppercase bg-red-950 px-1 rounded border border-red-800">ENCRYPTED</span>
              </div>
              <div className="text-slate-400">Audit Protocol: Active</div>
            </div>

            <button
              onClick={superAdminLogout}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-red-950/40 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>

        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900/50">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
