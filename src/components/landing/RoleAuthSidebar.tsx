import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, ShieldCheck, Sparkles, Building2, 
  ArrowRight, Lock, UserPlus, ChevronDown, ChevronUp, 
  CheckCircle2, BookOpen, KeyRound, ExternalLink, X
} from 'lucide-react';

interface RoleAuthSidebarProps {
  className?: string;
  isMobileDrawerOpen?: boolean;
  setIsMobileDrawerOpen?: (open: boolean) => void;
}

export const RoleAuthSidebar: React.FC<RoleAuthSidebarProps> = ({ 
  className = '', 
  isMobileDrawerOpen = false, 
  setIsMobileDrawerOpen 
}) => {
  const { openAuthModal } = useApp();

  const handleOrganizerClick = (action: 'login' | 'register') => {
    const url = new URL(window.location.href);
    url.searchParams.set('portal', 'organizer');
    if (action === 'register') {
      url.searchParams.set('action', 'register');
    }
    window.location.href = url.toString();
  };

  const roleCards = [
    {
      id: 'student' as const,
      title: 'Student Innovators',
      badge: 'Students & Hackers',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: GraduationCap,
      iconBg: 'bg-blue-100 text-blue-700',
      accentBorder: 'hover:border-blue-500',
      description: 'Participate in national hackathons, form cross-college teams & build portfolios.',
      loginLabel: 'Student Login',
      registerLabel: 'Register Student',
      onLogin: () => openAuthModal('student', 'login'),
      onRegister: () => openAuthModal('student', 'register')
    },
    {
      id: 'mentor' as const,
      title: 'Faculty & Mentors',
      badge: 'Faculty Guides',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: ShieldCheck,
      iconBg: 'bg-amber-100 text-amber-800',
      accentBorder: 'hover:border-amber-500',
      description: 'Guide student teams, review milestones & verify project achievements.',
      loginLabel: 'Mentor Login',
      registerLabel: 'Register Mentor',
      onLogin: () => openAuthModal('mentor', 'login'),
      onRegister: () => openAuthModal('mentor', 'register')
    },
    {
      id: 'scholar' as const,
      title: 'PhD Scholars',
      badge: 'Doctoral Labs',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Sparkles,
      iconBg: 'bg-purple-100 text-purple-800',
      accentBorder: 'hover:border-purple-500',
      description: 'Collaborate on translational research preprints, benchmarks & Vidwan profiles.',
      loginLabel: 'Scholar Login',
      registerLabel: 'Register Scholar',
      onLogin: () => openAuthModal('scholar', 'login'),
      onRegister: () => openAuthModal('scholar', 'register')
    },
    {
      id: 'organizer' as const,
      title: 'Institutions & Organizers',
      badge: 'Accreditation',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Building2,
      iconBg: 'bg-emerald-100 text-emerald-800',
      accentBorder: 'hover:border-emerald-500',
      description: 'Host college hackathons, submit official documentation & manage attendees.',
      loginLabel: 'Organizer Login',
      registerLabel: 'Host Event',
      onLogin: () => handleOrganizerClick('login'),
      onRegister: () => handleOrganizerClick('register')
    }
  ];

  const sidebarContent = (
    <aside className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-campus-border shadow-warm-lg p-4 sm:p-5 space-y-4 text-left">
      
      {/* Header */}
      <div className="border-b border-campus-border/80 pb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-campus-bright-red pulse-live" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-campus-deep-blue">
              Role Access & Portals
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-campus-deep-blue tracking-tight">
            Sign In / Register
          </h2>
          <p className="text-[11px] text-campus-muted-text mt-0.5 leading-snug">
            Choose your role to access your dedicated workspace or register.
          </p>
        </div>

        {setIsMobileDrawerOpen && (
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-campus-muted-text hover:bg-slate-100"
            aria-label="Close Role Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Cards List */}
      <div className="space-y-3">
        {roleCards.map(role => {
          const Icon = role.icon;

          return (
            <div
              key={role.id}
              className={`p-3.5 rounded-2xl bg-campus-warm-white/70 border border-campus-border/70 ${role.accentBorder} transition-all duration-200 shadow-warm-xs hover:shadow-warm-sm space-y-2.5 group`}
            >
              {/* Role Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${role.iconBg} flex items-center justify-center font-bold flex-shrink-0 shadow-warm-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-campus-deep-blue leading-none">
                      {role.title}
                    </h3>
                    <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded mt-0.5 border ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brief Description */}
              <p className="text-[10.5px] text-campus-slate-text/80 leading-relaxed">
                {role.description}
              </p>

              {/* Action Buttons: 2 Distinct Buttons per Role */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    role.onLogin();
                    if (setIsMobileDrawerOpen) setIsMobileDrawerOpen(false);
                  }}
                  className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-campus-deep-blue hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1 shadow-warm-xs"
                >
                  <Lock className="w-3 h-3 opacity-80" />
                  <span className="truncate">{role.loginLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    role.onRegister();
                    if (setIsMobileDrawerOpen) setIsMobileDrawerOpen(false);
                  }}
                  className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-campus-deep-blue border border-campus-border transition-colors flex items-center justify-center gap-1 shadow-warm-xs"
                >
                  <UserPlus className="w-3 h-3 opacity-70" />
                  <span className="truncate">{role.registerLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Trust Note */}
      <div className="pt-2 border-t border-campus-border/70 flex items-center justify-between text-[10px] text-campus-muted-text">
        <span className="flex items-center gap-1">
          <KeyRound className="w-3 h-3 text-campus-blue" />
          <span>National Single Sign-On</span>
        </span>
        <span className="font-semibold text-campus-blue">AICTE & UGC Aligned</span>
      </div>

    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <div className={`hidden lg:block w-80 flex-shrink-0 ${className}`}>
        <div className="sticky top-20">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-campus-deep-blue/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
