import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  GraduationCap, BookOpen, Megaphone, FolderKanban, Users,
  Compass, Calendar, Sparkles, Award, CheckCircle2, QrCode,
  MessageSquare, Bell, Settings, ShieldCheck, ChevronRight,
  ExternalLink, Sparkle
} from 'lucide-react';

interface StudentSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ onCloseMobile, className = '' }) => {
  const location = useLocation();
  const { currentUser, notifications, setIsAIModalOpen } = useApp();

  const navigationGroups = [
    {
      title: 'MY CAMPUS',
      items: [
        {
          label: 'Overview',
          path: '/student/dashboard',
          icon: GraduationCap,
          badge: null
        },
        {
          label: 'Academics',
          path: '/student/academics',
          icon: BookOpen,
          badge: 'SIS'
        },
        {
          label: 'Announcements',
          path: '/student/announcements',
          icon: Megaphone,
          badge: null
        }
      ]
    },
    {
      title: 'DISCOVER',
      items: [
        {
          label: 'Projects',
          path: '/student/projects',
          icon: FolderKanban,
          badge: null
        },
        {
          label: 'Teams',
          path: '/student/teams',
          icon: Users,
          badge: null
        },
        {
          label: 'Mentorship',
          path: '/student/mentorship',
          icon: Compass,
          badge: null
        },
        {
          label: 'Events',
          path: '/student/events',
          icon: Calendar,
          badge: null
        },
        {
          label: 'Opportunities',
          path: '/student/opportunities',
          icon: Sparkles,
          badge: 'Hot'
        }
      ]
    },
    {
      title: 'MY GROWTH',
      items: [
        {
          label: 'Career & Portfolio',
          path: '/student/portfolio',
          icon: Award,
          badge: null
        },
        {
          label: 'Skills & Badges',
          path: '/student/skills',
          icon: CheckCircle2,
          badge: null
        },
        {
          label: 'Certificates',
          path: '/student/certificates',
          icon: QrCode,
          badge: 'Verified'
        }
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        {
          label: 'Messages',
          path: '/student/messages',
          icon: MessageSquare,
          badge: null
        },
        {
          label: 'Notifications',
          path: '/student/notifications',
          icon: Bell,
          badge: notifications.length > 0 ? `${notifications.length}` : null,
          badgeType: 'alert'
        },
        {
          label: 'Settings & Privacy',
          path: '/student/settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none overflow-hidden ${className}`}
    >
      {/* Scrollable Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {group.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                  (item.path === '/student/dashboard' && (location.pathname === '/student' || location.pathname === '/student/'));

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-50/90 text-campus-blue font-bold shadow-2xs border border-blue-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-campus-blue' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md shrink-0 ml-1.5 ${
                          (item as any).badgeType === 'alert'
                            ? 'bg-campus-red text-white'
                            : isActive
                              ? 'bg-blue-200/80 text-blue-900'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* AI Copilot Callout Card */}
        <div className="pt-2 px-1">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">
                  Campus AI Copilot
                </span>
              </div>
              <p className="text-[11px] text-blue-100/90 leading-snug">
                Ask for project ideas, review milestones, or find student co-founders.
              </p>
              <button
                onClick={() => {
                  setIsAIModalOpen(true);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full mt-1 px-3 py-1.5 bg-white text-slate-900 hover:bg-blue-50 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Launch Assistant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Persistent Student Identity Pill at Bottom */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        <NavLink
          to="/student/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white transition-colors group"
        >
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'Student'}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
            />
            {currentUser?.verifiedStudent && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-campus-blue transition-colors">
              {currentUser?.name || 'Student'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {(currentUser as any)?.rollNumber || currentUser?.studentId || '22CS1048'} • {currentUser?.year || 'UG'}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
